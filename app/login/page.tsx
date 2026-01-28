import { Button } from "@/components/ui/button"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

const Login = () => {
    return (
        <div className="w-80 mx-4">
            <FieldGroup>
                <Field>
                    <FieldLabel htmlFor="fieldgroup-name">Name</FieldLabel>
                    <Input id="fieldgroup-name" placeholder="Enter your Name" />
                </Field>
                <Field>
                    <FieldLabel htmlFor="fieldgroup-email">Email</FieldLabel>
                    <Input
                        id="fieldgroup-email"
                        type="email"
                        placeholder="name@example.com"
                    />
                    <FieldDescription>
                        We&apos;ll send updates to this address.
                    </FieldDescription>
                </Field>
                <Field orientation="horizontal">
                    <Button type="reset" variant="outline">
                        Reset
                    </Button>
                    <Button type="submit">Submit</Button>
                </Field>
            </FieldGroup>
        </div>
    )
}

export default Login