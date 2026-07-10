import asyncio
import uuid
from fastapi import APIRouter
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes
from app.services.chat_service import process_user_message
from app.core.rate_limit import telegram_rate_limiter

from app.core.database import AsyncSessionLocal

from app.core.config import settings

router = APIRouter(
    prefix="/telegram",
    tags=["telegram"]
)

TELEGRAM_BOT_TOKEN = settings.TELEGRAM_BOT_TOKEN

async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handles the /start command."""
    user_name = update.effective_user.first_name or "User"
    await update.message.reply_text(
        f"Hello {user_name}! FlyBot Welcomes you to our Nisir official assistant bot. How can I help you today?"
    )

async def handle_telegram_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Captures all text messages and feeds them directly into your existing ChatService."""
    user_message = update.message.text
    telegram_chat_id = str(update.effective_chat.id) 

    # 🛠️ Convert the Telegram numeric ID into a valid, persistent UUID format
    telegram_uuid = str(uuid.uuid5(uuid.NAMESPACE_DNS, telegram_chat_id))

    # Apply rate limiting based on the user's UUID (conversation_id)
    if not telegram_rate_limiter.is_allowed(telegram_uuid):
        await update.message.reply_text("You are sending messages too fast. Please wait a moment.")
        return

    await context.bot.send_chat_action(chat_id=telegram_chat_id, action="typing")

    try:
        # Instantiate your existing chatbot service logic
        async with AsyncSessionLocal() as db:
            
            # 🛠️ FIX 3: Call your actual async pipeline function directly
            result = await process_user_message(
                db=db,
                message_text=user_message,
                conversation_id=telegram_uuid  # Use the generated UUID for conversation tracking
            )
            
            # Extract the string response from the returned dictionary
            ai_response = result.get("response", "No response generated.")
        
        # Reply back to the user on Telegram
        await update.message.reply_text(ai_response)
        
    except Exception as e:
        print(f"Error processing message for Telegram: {e}")
        await update.message.reply_text("Sorry, I ran into an error processing your request.")

async def run_telegram_bot():
    """Initializes and starts the bot application using long polling."""
    print("Starting Telegram Bot long-polling service...")
    
    # Initialize the python-telegram-bot application
    application = Application.builder().token(TELEGRAM_BOT_TOKEN).build()

    # Register handlers
    application.add_handler(CommandHandler("start", start_command))
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_telegram_message))

    # Initialize and start polling
    await application.initialize()
    await application.start()
    await application.updater.start_polling()
    
    # Keep it running while the main app loop stays alive
    while True:
        await asyncio.sleep(3600)