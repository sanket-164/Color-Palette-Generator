"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import cookies from "js-cookie";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginFormSchema } from "@/lib/formSchemas";
import { AuthFns } from "@/lib/interactions/dataPosters";
import { TOKEN_COOKIE_KEY } from "@/lib/constants";

export default function LoginPage() {
  const { mutate, isPending } = useMutation({
    mutationFn: AuthFns.login,
  });
  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
  });
  const router = useRouter();

  function onSubmit(data: z.infer<typeof LoginFormSchema>) {
    mutate(data, {
      onSuccess: (data) => {
        if (data.success) {
          toast.success(data.message);
          cookies.set(TOKEN_COOKIE_KEY, data.token ?? "");
          router.push("/");
        } else {
          toast.error(data.message);
        }
      },
      onError: () => {
        toast.error("An error occurred");
      },
    });
  }
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="absolute top-0 -z-10 left-0 h-full w-full bg-gradient-to-b from-blue-500 to-blue-700" />
      <Card>
        <CardHeader className="w-full md:w-[400px]">
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-6"
            >
              <FormField
                control={form.control}
                disabled={isPending}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="ldce@ac.in" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                disabled={isPending}
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center justify-between">
                <Button disabled={isPending} type="submit">
                  Login
                </Button>
                <Button
                  variant="link"
                  disabled={isPending}
                  className="text-sm font-normal"
                >
                  <Link href="/register">
                    Don&apos;t have an account? Register
                  </Link>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
