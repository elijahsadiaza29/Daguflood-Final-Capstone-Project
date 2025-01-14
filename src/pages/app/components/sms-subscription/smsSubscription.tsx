import { database } from "../../../../firebaseConfig";
import { ref, push, get } from "firebase/database";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
    phoneNumber: z
        .string()
        .min(11, "Phone number must be at least 11 digits")
        .max(13, "Phone number must not exceed 13 digits")
        .regex(
            /^(\+63|0)[\d]{10}$/,
            "Please enter a valid Philippines phone number (+639XXXXXXXXX or 09XXXXXXXXX)"
        ),
});

export const SmsSubscription = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            phoneNumber: "",
        },
    });

    const handleSubscribe = async (values: z.infer<typeof formSchema>) => {
        try {
            // Format phone number to ensure +63 prefix
            const formattedNumber = values.phoneNumber.startsWith("0")
                ? "+63" + values.phoneNumber.slice(1)
                : values.phoneNumber;

            // Check for duplicate
            const subscribersRef = ref(database, "smsSubscribers");
            const snapshot = await get(subscribersRef);
            const subscribers = snapshot.val();

            if (subscribers) {
                const isDuplicate = Object.values(subscribers).some(
                    (sub: any) => {
                        // Normalize both numbers for comparison
                        const normalizedStoredNumber = sub.phoneNumber.replace(/\s+/g, "").replace(/^0/, "+63");
                        const normalizedNewNumber = formattedNumber.replace(/\s+/g, "").replace(/^0/, "+63");
                        console.log('Comparing:', normalizedStoredNumber, 'with', normalizedNewNumber);
                        return normalizedStoredNumber === normalizedNewNumber;
                    }
                );

                if (isDuplicate) {
                    toast.error("This phone number is already subscribed!");
                    return;
                }
            }

            // If not duplicate, proceed with subscription
            await push(ref(database, "smsSubscribers"), {
                phoneNumber: formattedNumber,
                subscribedAt: new Date().toISOString(),
            });

            toast.success("Successfully subscribed to SMS alerts!");
            form.reset();
        } catch (error) {
            console.error("Subscription error:", error);
            toast.error("Failed to subscribe. Please try again later.");
        }
    };

    return (
        <Card className="border-none text-white ">
            <CardHeader>
                <CardTitle className="text-left">Text Alerts </CardTitle>
                <CardDescription className="text-left">
                    Get instant text messages when there's a flood alert.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubscribe)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="phoneNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-left w-full block">Phone Number</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="+639XXXXXXXXX"
                                            {...field}
                                            type="tel"
                                        />
                                    </FormControl>
                                    <FormDescription className="text-left">
                                        Enter your phone number in +63 or 09 format
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            className="w-full text-white"
                            disabled={form.formState.isSubmitting}
                        >
                            {form.formState.isSubmitting ? "Subscribing..." : "Get Messages"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};