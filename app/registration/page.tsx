"use client"

import { Button } from "@/components/ui/button"
import {
    Field,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { RegisterFormValues, registerSchema } from "@/schema/registerSchema"
import { registerUser } from "@/lib/api"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"

const Register = () => {
    const router = useRouter()
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    })

    const onSubmit = async (data: RegisterFormValues) => {
        try {
            const res = await registerUser(data)
            if (res) {
                router.push("/login")
            }
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
                    <h1 className="text-2xl font-bold">Create Account</h1>
                    <p className="text-sm text-muted-foreground">
                        Sign up to get started
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="username">Username</FieldLabel>
                            <Input
                                id="username"
                                placeholder="Choose a username"
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
                                placeholder="Create a password"
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
                                onClick={() => reset()}
                                disabled={isSubmitting}
                            >
                                Reset
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Registering..." : "Register"}
                            </Button>
                        </Field>
                    </FieldGroup>
                </form>
            </div>
        </div>
    )
}

export default Register