import React, { useState, useEffect } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { feedbackDB } from '../../../../firebaseConfig';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface FeedbackFormProps {
    onClose: () => void;
    open: boolean;
}

const emojis = [
    { value: 1, icon: '😣', label: 'Very Dissatisfied' },
    { value: 2, icon: '🙁', label: 'Dissatisfied' },
    { value: 3, icon: '😊', label: 'Neutral' },
    { value: 4, icon: '😄', label: 'Satisfied' },
    { value: 5, icon: '😍', label: 'Very Satisfied' }
] as const;

const services = [
    'Overall Service',
    'Accuracy',
    'Alert Response Time',
    'Real-time Updates',
] as const;

type Service = typeof services[number];

interface FeedbackData {
    userRating: {
        score: number;
        sentiment: string;
    };
    areasForImprovement: Service[] | ['No areas selected']; 
    userSuggestion: string;
}

const LoadingSpinner = () => (
    <svg
        className="animate-spin h-5 w-5 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
    >
        <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="1"
        />
        <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
    </svg>
);

const FeedbackForm: React.FC<FeedbackFormProps> = ({ onClose, open }) => {
    const [rating, setRating] = useState<number>(0);
    const [selectedServices, setSelectedServices] = useState<Service[]>([]);
    const [suggestion, setSuggestion] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [hasInteracted, setHasInteracted] = useState<boolean>(false);

    const getRatingText = (ratingValue: number): string => {
        const emoji = emojis.find(e => e.value === ratingValue);
        return emoji?.label || 'Not Rated';
    };

    const handleServiceToggle = (service: Service) => {
        setSelectedServices(prev =>
            prev.includes(service)
                ? prev.filter(s => s !== service)
                : [...prev, service]
        );
        setHasInteracted(true);
    };

    const validateFeedback = (): boolean => {
        if (rating === 0) {
            setError('Please select a rating');
            return false;
        }
        return true;
    };

    const prepareFeedbackData = (): FeedbackData => ({
        userRating: {
            score: rating,
            sentiment: getRatingText(rating)
        },
        areasForImprovement: selectedServices.length > 0 
            ? selectedServices 
            : ['No areas selected'],
        userSuggestion: suggestion.trim() || 'No additional suggestions provided'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateFeedback()) return;

        setIsSubmitting(true);
        setError('');

        const loadingToastId = toast.loading('Submitting feedback...');

        try {
            const feedbackData = prepareFeedbackData();
            await addDoc(collection(feedbackDB, 'feedback'), {
                feedbackDetails: feedbackData,
                timestamp: serverTimestamp()
            });

            toast.dismiss(loadingToastId);
            toast.success('Thank you for your feedback!', {
                description: 'Your input helps us improve our service.'
            });

            // Reset form
            setRating(0);
            setSelectedServices([]);
            setSuggestion('');
            setHasInteracted(false);
            onClose();
        } catch (error) {
            console.error('Error submitting feedback:', error);
            toast.dismiss(loadingToastId);
            toast.error('Failed to submit feedback', {
                description: 'Please try again later.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={isSubmitting ? undefined : onClose}>
            <DialogContent className="sm:max-w-[450px] max-w-[350px] sm:rounded-2xl rounded-3xl p-4">
                <Card className="border-none">
                    <CardHeader>
                        <CardTitle>Help Us Improve</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md dark:bg-red-950 dark:text-red-300">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-4">
                                <div className="flex justify-around">
                                    {emojis.map(({ value, icon, label }) => (
                                        <button
                                            key={value}
                                            type="button"
                                            onClick={() => {
                                                setRating(value);
                                                setError('');
                                                setHasInteracted(true);
                                            }}
                                            className={cn(
                                                "text-3xl transition-all rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-primary hover:scale-110",
                                                rating === value && "scale-125 transform-gpu"
                                            )}
                                            aria-label={label}
                                        >
                                            {icon}
                                        </button>
                                    ))}
                                </div>

                                <div className="space-y-2">
                                    <p className="text-sm text-muted-foreground">
                                        What areas need improvement?
                                    </p>
                                    <div className="grid grid-cols-2 gap-2">
                                        {services.map(service => (
                                            <Button
                                                key={service}
                                                type="button"
                                                onClick={() => handleServiceToggle(service)}
                                                variant={selectedServices.includes(service) ? "secondary" : "outline"}
                                                className={cn(
                                                    "h-auto py-2 px-4 text-xs sm:text-sm transition-all",
                                                    selectedServices.includes(service) && "ring-2 ring-primary"
                                                )}
                                            >
                                                {service}
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                <Textarea
                                    placeholder="Additional suggestions or comments..."
                                    value={suggestion}
                                    onChange={(e) => {
                                        setSuggestion(e.target.value);
                                        setHasInteracted(true);
                                    }}
                                    className="min-h-[100px] resize-none"
                                />

                                <Button
                                    type="submit"
                                    disabled={isSubmitting || !hasInteracted}
                                    className="w-full"
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center gap-2">
                                            <LoadingSpinner />
                                            <span>Submitting...</span>
                                        </div>
                                    ) : (
                                        'Submit Feedback'
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </DialogContent>
        </Dialog>
    );
};

export const FeedbackTimer: React.FC = () => {
    const [showFeedback, setShowFeedback] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowFeedback(true);
        }, 30000); // Show after 1 minute

        return () => clearTimeout(timer);
    }, []);

    return <FeedbackForm open={showFeedback} onClose={() => setShowFeedback(false)} />;
};