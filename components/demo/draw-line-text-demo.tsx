import { DrawLineText } from "@/components/ui/draw-line-text";

export const Demo = () => {
    return (
        <DrawLineText
            className="font-medium"
            fontSize={60}
            strokeWidth={1.5}
            text="21st.dev"
            color="var(--color-foreground)"
        />
    );
};

export default Demo;
