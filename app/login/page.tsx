"use client"

import { Button } from "@/components/ui/button";
import {
    Field,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import axios from "axios";
import { login } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormValues, loginSchema } from "@/lib/shema";

const Login = () => {
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
    });

    const onSubmit = async (data: LoginFormValues) => {
        try {
            const res = await login(data);

            console.log("Access Token:", res.accessToken);
            console.log("Refresh Token:", res.refreshToken);

            reset();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error(error.response?.data?.message);
            }
        }
    };

    return (
        <div className="w-80 mx-4">
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
                            onClick={() => reset()}
                            disabled={isSubmitting}
                        >
                            Reset
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Logging in..." : "Login"}
                        </Button>
                    </Field>
                </FieldGroup>
            </form>
        </div>
    );
};

export default Login;
