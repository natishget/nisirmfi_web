import { NextRequest, NextResponse } from "next/server";

import { handleApiError } from "@/lib/api/error";
import { requireAdminAccess } from "@/lib/auth/admin";
import {
  deleteNews,
  getNewsById,
  updateNews,
} from "@/lib/services/news.service";
import { newsUpdateSchema } from "@/lib/validators/news";
import { validateAndSaveImage, deleteImageFile } from "@/lib/api/upload";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const news = await getNewsById(id);

    return NextResponse.json({ data: news });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    await requireAdminAccess(request);
    const { id } = await context.params;
    await deleteNews(id);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  return handleUpdate(request, context);
}

export async function PUT(request: NextRequest, context: RouteContext) {
  return handleUpdate(request, context);
}

async function handleUpdate(request: NextRequest, context: RouteContext) {
  try {
    await requireAdminAccess(request);
    const { id } = await context.params;

    const contentType = request.headers.get("content-type") ?? "";
    let updateData: any = {};

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();

      if (formData.has("title")) updateData.title = formData.get("title") as string;
      if (formData.has("category")) updateData.category = formData.get("category") as string;
      if (formData.has("summary")) updateData.summary = formData.get("summary") as string;
      
      if (formData.has("status")) {
        const statusVal = formData.get("status") as string;
        updateData.status =
          statusVal === "Published" ? "PUBLISHED" :
          statusVal === "Draft" ? "DRAFT" :
          statusVal === "Scheduled" ? "ARCHIVED" :
          (["PUBLISHED", "DRAFT", "ARCHIVED"].includes(statusVal) ? statusVal : undefined);
      }

      if (formData.has("publishedAt")) {
        const pubAt = formData.get("publishedAt") as string;
        updateData.publishedDate = pubAt ? new Date(pubAt) : undefined;
      }

      if (formData.has("readTime")) {
        const readTimeRaw = formData.get("readTime") as string;
        const match = readTimeRaw.match(/\d+/);
        if (match) {
          updateData.readTime = parseInt(match[0], 10);
        }
      }

      if (formData.has("featured")) {
        updateData.isFeatured = formData.get("featured") === "true";
      }

      // Handle image updates
      const file = formData.get("image") as File | null;
      if (file && file.size > 0) {
        // Fetch existing news item to find its old image
        const existingNews = await getNewsById(id);
        
        // Save new image
        const newImagePath = await validateAndSaveImage(file);
        updateData.imageUrl = newImagePath;

        // Clean up old image if it is a local file
        if (existingNews?.imageUrl) {
          await deleteImageFile(existingNews.imageUrl);
        }
      } else {
        const existingImageUrl = formData.get("existingImageUrl") as string | null;
        if (existingImageUrl) {
          updateData.imageUrl = existingImageUrl;
        }
      }
    } else {
      // Handle standard JSON body updates
      const json = await request.json();
      
      // Parse status if present
      if (json.status) {
        json.status =
          json.status === "Published" ? "PUBLISHED" :
          json.status === "Draft" ? "DRAFT" :
          json.status === "Scheduled" ? "ARCHIVED" :
          json.status;
      }
      
      // Map publishedAt to publishedDate if present
      if (json.publishedAt) {
        json.publishedDate = new Date(json.publishedAt);
        delete json.publishedAt;
      }
      
      if (json.readTime && typeof json.readTime === "string") {
        const match = json.readTime.match(/\d+/);
        if (match) {
          json.readTime = parseInt(match[0], 10);
        }
      }

      if (json.featured !== undefined) {
        json.isFeatured = json.featured;
        delete json.featured;
      }

      if (json.image !== undefined) {
        json.imageUrl = json.image;
        delete json.image;
      }

      updateData = json;
    }

    // Validate using Zod schema
    const validatedBody = newsUpdateSchema.parse(updateData);

    const news = await updateNews(id, validatedBody);

    return NextResponse.json({ data: news });
  } catch (error) {
    return handleApiError(error);
  }
}
