import * as stylex from "@stylexjs/stylex";
import { colors, radius } from "@/styles/tokens.stylex";
import { techStackIcons, validTechStacks } from "@/config/tech-stacks";

const styles = stylex.create({
  fallback: {
    width: "1.25rem",
    height: "1.25rem",
    borderRadius: radius.full,
    backgroundColor: "rgba(161, 161, 170, 0.2)",
  },
  inlineFlex: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
  },
});

export { techStackIcons, validTechStacks };

interface TechStackIconProps {
  tech: string;
  size?: number;
  iconOnly?: boolean;
}

export function TechStackIcon({
  tech,
  size = 20,
  iconOnly = false,
}: TechStackIconProps) {
  const Icon = techStackIcons[tech];

  if (!Icon) {
    if (iconOnly) {
      return <span {...stylex.props(styles.fallback)} />;
    }
    return (
      <span {...stylex.props(styles.inlineFlex)}>
        <span {...stylex.props(styles.fallback)} />
        <span>{tech}</span>
      </span>
    );
  }

  if (iconOnly) {
    return <Icon size={size} />;
  }

  return (
    <span {...stylex.props(styles.inlineFlex)}>
      <Icon size={size} />
      <span>{tech}</span>
    </span>
  );
}
