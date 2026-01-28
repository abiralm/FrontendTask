"use client"

import { Button } from "@/components/ui/button";
import {
    Field,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { RegisterFormValues, registerSchema } from "@/schema/registerSchema";
import { AuthType } from "@/types/authTypes";
import { registerUser } from "@/lib/api";
import { useForm } from "react-hook-form";

const Register = () => {
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
    });

    const onSubmit = async (data: RegisterFormValues) => {
        try {
            const res = await registerUser(data);
            console.log("Registered user:", res);
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
    );
};

export default Register;
