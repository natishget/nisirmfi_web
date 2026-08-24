"use client";

import { useEffect, useMemo, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AtSign, Pencil, Plus, Search, Trash2, UserRound } from "lucide-react";

type UserRecord = {
  id: string;
  email: string;
  fullName: string;
};

const userFormSchema = z.object({
  email: z.string().trim().toLowerCase().email("Valid email required"),
  fullName: z
    .string()
    .trim()
    .min(2, "Full name is required")
    .max(150, "Full name is too long"),
  password: z
    .string()
    .trim()
    .refine((value) => value === "" || value.length >= 8, {
      message: "Password must be at least 8 characters",
    }),
});

type UserFormValues = z.infer<typeof userFormSchema>;

const defaultFormValues: UserFormValues = {
  email: "",
  fullName: "",
  password: "",
};

function toFormValues(user?: UserRecord | null): UserFormValues {
  if (!user) {
    return defaultFormValues;
  }

  return {
    email: user.email,
    fullName: user.fullName,
    password: "",
  };
}

import {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useChangePasswordUserMutation,
  useDeleteUserMutation,
} from "@/state/api/ApiSlice";

export default function UserManagementClient() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<UserRecord | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const { data: usersQueryData, isLoading: isUsersLoading } = useGetUsersQuery();
  const [createUser] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [changePasswordUser] = useChangePasswordUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const users = useMemo(() => {
    if (!usersQueryData) return [];
    return usersQueryData.map((u: any) => ({
      id: u.userId,
      email: u.email,
      fullName: u.fullName,
    }));
  }, [usersQueryData]);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: defaultFormValues,
  });

  useEffect(() => {
    reset(toFormValues(editingUser));
    clearErrors();
  }, [clearErrors, editingUser, editorOpen, reset]);

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return users;
    }

    return users.filter((user) =>
      `${user.fullName} ${user.email}`.toLowerCase().includes(term),
    );
  }, [search, users]);

  const stats = useMemo(
    () => ({
      total: users.length,
      matching: filteredUsers.length,
    }),
    [filteredUsers.length, users.length],
  );

  const openCreate = () => {
    setEditingUser(null);
    setSubmitError(null);
    setEditorOpen(true);
    reset(defaultFormValues);
    clearErrors();
  };

  const openEdit = (user: UserRecord) => {
    setEditingUser(user);
    setSubmitError(null);
    setEditorOpen(true);
    reset(toFormValues(user));
    clearErrors();
  };

  const closeEditor = () => {
    setEditorOpen(false);
    setEditingUser(null);
    setSubmitError(null);
    clearErrors();
  };



  const submitUser = async (values: UserFormValues) => {
    const payload = {
      email: values.email.trim().toLowerCase(),
      fullName: values.fullName.trim(),
      ...(values.password.trim() ? { password: values.password.trim() } : {}),
    };

    if (!editingUser && !payload.password) {
      setError("password", {
        type: "manual",
        message: "Password is required for new users",
      });
      return;
    }

    const isEditing = Boolean(editingUser);
    try {
      if (isEditing && editingUser) {
        // If password is changed, run password change mutation first
        if (payload.password) {
          await changePasswordUser({ id: editingUser.id, body: { password: payload.password } }).unwrap();
        }
        await updateUser({ id: editingUser.id, body: { email: payload.email, fullName: payload.fullName } }).unwrap();
      } else {
        await createUser(payload).unwrap();
      }
      closeEditor();
      reset(defaultFormValues);
    } catch (err: any) {
      setSubmitError(err?.data?.message || "Unable to save user");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    setDeleteError(null);
    try {
      await deleteUser(deleteTarget.id).unwrap();
      setDeleteTarget(null);
    } catch (err: any) {
      setDeleteError(err?.data?.message || "Unable to delete user");
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7ff]">
      <section className="bg-[#22348A] py-16 text-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <span className="mb-5 block h-px w-8 bg-white/60" />
          <h1 className="display-text text-3xl sm:text-4xl">User Management</h1>
          <p className="mt-3 max-w-2xl text-white/70">
            Create, update, and remove user accounts from a single secure admin
            workspace.
          </p>
        </div>
      </section>

      <section className="relative -mt-10 pb-20">
        <div className="mx-auto max-w-7xl space-y-6 px-5 sm:px-8 lg:px-10">
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { label: "Total accounts", value: stats.total },
              { label: "Search matches", value: stats.matching },
            ].map((card) => (
              <div
                key={card.label}
                className="rounded-2xl border border-white/70 bg-white p-5 shadow-[0_16px_50px_rgba(34,52,138,0.08)]"
              >
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                  {card.label}
                </p>
                <p className="mt-2 text-3xl font-semibold text-[#22348A]">
                  {card.value}
                </p>
              </div>
            ))}
          </div>

          <div className="overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-[0_24px_80px_rgba(34,52,138,0.09)]">
            <div className="border-b border-slate-100 p-5 sm:p-6">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <h2 className="display-text text-2xl text-[#22348A]">
                    Accounts
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Manage user profiles and credentials without leaving the
                    admin console.
                  </p>
                </div>

                <div className="flex flex-col gap-3 md:flex-row md:items-center">
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search users..."
                      className="h-11 w-full rounded-full pl-10 md:w-72"
                    />
                  </div>

                  <Button type="button" onClick={openCreate}>
                    <Plus className="h-4 w-4" />
                    Add user
                  </Button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/80 hover:bg-slate-50/80">
                    <TableHead className="pl-6">User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="pr-6 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="px-6 py-16 text-center">
                        <div className="mx-auto flex max-w-sm flex-col items-center gap-3 text-slate-500">
                          <div className="rounded-2xl bg-[#f0f3fc] p-4 text-[#22348A]">
                            <UserRound className="h-6 w-6" />
                          </div>
                          <p className="text-base font-medium text-slate-700">
                            No users match the current search.
                          </p>
                          <p className="text-sm">
                            Clear the search or create a new user to get
                            started.
                          </p>
                          <Button type="button" onClick={openCreate}>
                            <Plus className="h-4 w-4" />
                            Create user
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="pl-6 py-5 align-top">
                          <div className="min-w-0">
                            <p className="font-semibold leading-snug text-[#22348A]">
                              {user.fullName}
                            </p>
                            <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-2.5 py-1 text-slate-600">
                                <UserRound className="h-3.5 w-3.5" />
                                Admin account
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center gap-2 text-sm text-slate-600">
                            <AtSign className="h-3.5 w-3.5 text-slate-400" />
                            {user.email}
                          </span>
                        </TableCell>
                        <TableCell className="pr-6 text-right">
                          <div className="inline-flex items-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => openEdit(user)}
                            >
                              <Pencil className="h-4 w-4" />
                              Edit
                            </Button>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => setDeleteTarget(user)}
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </section>

      <Dialog open={editorOpen} onOpenChange={(open) => !open && closeEditor()}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl text-[#22348A]">
              {editingUser ? "Edit user" : "Add user"}
            </DialogTitle>
            <DialogDescription>
              {editingUser
                ? "Update profile details and optionally reset the password."
                : "Create a new account with a name, email address, and password."}
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleSubmit(submitUser)}
            className="space-y-4"
            noValidate
          >
            <div className="space-y-2">
              <label
                htmlFor="fullName"
                className="text-sm font-medium text-slate-700"
              >
                Full name
              </label>
              <Input
                id="fullName"
                {...register("fullName")}
                placeholder="Jane Doe"
              />
              {errors.fullName ? (
                <p className="text-sm text-red-600">
                  {errors.fullName.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-slate-700"
              >
                Email address
              </label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="name@company.com"
                autoComplete="email"
              />
              {errors.email ? (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-slate-700"
              >
                {editingUser ? "Password (optional)" : "Password"}
              </label>
              <Input
                id="password"
                type="password"
                {...register("password")}
                placeholder={
                  editingUser
                    ? "Leave blank to keep current password"
                    : "Minimum 8 characters"
                }
                autoComplete="new-password"
              />
              {errors.password ? (
                <p className="text-sm text-red-600">
                  {errors.password.message}
                </p>
              ) : (
                <p className="text-xs text-slate-400">
                  {editingUser
                    ? "Leave this empty if the password does not need to change."
                    : "A password is required for newly created users."}
                </p>
              )}
            </div>

            {submitError ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {submitError}
              </div>
            ) : null}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeEditor}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? "Saving..."
                  : editingUser
                    ? "Save changes"
                    : "Create user"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null);
            setDeleteError(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete user?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget ? (
                <span>
                  This will permanently remove{" "}
                  <strong>{deleteTarget.fullName}</strong> ({deleteTarget.email}
                  ) from the system.
                </span>
              ) : null}
            </AlertDialogDescription>
          </AlertDialogHeader>

          {deleteError ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {deleteError}
            </div>
          ) : null}

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault();
                void confirmDelete();
              }}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Delete user
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
