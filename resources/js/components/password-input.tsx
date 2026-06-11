import type { ComponentProps, Ref } from 'react';
import { Input } from '@/components/ui/input';

export default function PasswordInput({
    className,
    ref,
    ...props
}: Omit<ComponentProps<'input'>, 'type'> & { ref?: Ref<HTMLInputElement> }) {
    return (
        <Input
            type="password"
            className={className}
            ref={ref}
            {...props}
        />
    );
}
