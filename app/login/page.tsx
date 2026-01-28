"use client"

import { Button } from "@/components/ui/button"
import {
    Field,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import axios from "axios"
import { login } from "@/lib/api"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoginFormValues, loginSchema } from "@/schema/loginSchema"
import { useAuth } from "@/lib/auth/authContext"
import { setRefreshToken } from "@/lib/auth/authStorage"
import { useRouter } from "next/navigation"

const Login = () => {
    const { setAccessToken } = useAuth()
    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    })

    const onSubmit = async (data: LoginFormValues) => {
        try {
            const res = await login(data)

            setAccessToken(res.accessToken)
            setRefreshToken(res.refreshToken)
            router.push("/invoices")

            reset()
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error(error.response?.data?.message)
            }
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted">
            <div className="w-full max-w-sm border rounded-2xl bg-background p-6 shadow-sm">
                {/* Title */}
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-bold">Login</h1>
                    <p className="text-sm text-muted-foreground">
                        Sign in to your account
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="username">Username</FieldLabel>
                            <Input
                                id="username"
                                placeholder="Enter your username"
                                {...register("username")}
                            />
                            {errors.username && (
                                <p className="text-sm text-destructive mt-1">
                                    {errors.username.message}
                                </p>
                            )}
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="password">Password</FieldLabel>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                {...register("password")}
                            />
                            {errors.password && (
                                <p className="text-sm text-destructive mt-1">
                                    {errors.password.message}
                                </p>
                            )}
                        </Field>

                        <Field orientation="horizontal">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.push("/registration")}
                                disabled={isSubmitting}
                            >
                                Not Registered ?
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Logging in..." : "Login"}
                            </Button>
                        </Field>
                    </FieldGroup>
                </form>
            </div>
        </div>
    )
}

export default Login