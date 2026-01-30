import { FaDiscord, FaGithub, FaTelegram, FaTwitter } from "react-icons/fa";
import { IoMail } from "react-icons/io5";
import Image from "rpress/image";
import CONFIG from "@/config/config.json";
import type { Lang } from "@/utils/i18n/config";
import { createTranslate } from "@/utils/i18n/server";
import * as stylex from "@stylexjs/stylex";
import { colors, spacing, fontSize } from "@/styles/tokens.stylex";

const styles = stylex.create({
  container: {
    display: "flex",
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
    flexDirection: {
      default: "column-reverse",
      "@media (min-width: 768px)": "row",
    },
    gap: {
      default: spacing.xl,
      "@media (min-width: 768px)": "4rem",
    },
    alignItems: {
      default: "center",
      "@media (min-width: 768px)": "stretch",
    },
  },
  leftSide: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
  greeting: {
    marginLeft: {
      default: "auto",
      "@media (min-width: 768px)": 0,
    },
    marginRight: {
      default: "auto",
      "@media (min-width: 768px)": 0,
    },
  },
  name: {
    fontSize: {
      default: fontSize["4xl"],
      "@media (min-width: 768px)": fontSize["6xl"],
    },
    fontWeight: 700,
    marginTop: "0.25rem",
    alignItems: "center",
    marginLeft: {
      default: "auto",
      "@media (min-width: 640px)": 0,
    },
    marginRight: {
      default: "auto",
    },
  },
  role: {
    fontFamily: "monospace",
    marginTop: "0.25rem",
    marginLeft: {
      default: "auto",
      "@media (min-width: 768px)": 0,
    },
    marginRight: {
      default: "auto",
      "@media (min-width: 768px)": 0,
    },
  },
  description: {
    marginTop: "0.25rem",
    fontSize: fontSize.lg,
    marginLeft: {
      default: "auto",
      "@media (min-width: 768px)": 0,
    },
    marginRight: {
      default: "auto",
      "@media (min-width: 768px)": 0,
    },
  },
  socialLinks: {
    display: "flex",
    gap: spacing.xl,
    marginLeft: {
      default: "auto",
      "@media (min-width: 768px)": 0,
    },
    marginRight: {
      default: "auto",
      "@media (min-width: 768px)": 0,
    },
    marginTop: {
      default: spacing.md,
      "@media (min-width: 768px)": "auto",
    },
  },
  socialIcon: {
    width: "1.5rem",
    height: "1.5rem",
    cursor: "pointer",
    transitionDuration: "200ms",
    fill: {
      default: colors.primary700,
      ":hover": colors.primary950,
      ":is(.dark *)": colors.primary300,
      ":is(.dark *):hover": colors.primary50,
    },
  },
  imageContainer: {
    display: "flex",
    alignItems: "center",
  },
  avatar: {
    borderRadius: "9999px",
    width: {
      default: "10rem",
      "@media (min-width: 768px)": "12rem",
    },
    height: {
      default: "10rem",
      "@media (min-width: 768px)": "12rem",
    },
    boxShadow: `0 4px 6px -1px ${colors.primary500}20`,
  },
});

async function About({ lang }: { lang: Lang }) {
  const t = await createTranslate(lang);
  const birthData = new Date(CONFIG.birth);
  const range = Date.now() - birthData.getTime();
  const age = Math.floor(range / (1000 * 60 * 60 * 24 * 365.25));

  return (
    <div {...stylex.props(styles.container)}>
      {/*left side*/}
      <div {...stylex.props(styles.leftSide)}>
        <p {...stylex.props(styles.greeting)}>{t("about.greeting")}</p>
        <h1 {...stylex.props(styles.name)}>{t("about.name")}</h1>
        <p
          {...stylex.props(styles.role)}
        >{`${age} y/o • ${t("about.role")}`}</p>
        <p {...stylex.props(styles.description)}>{t("about.description")}</p>
        <div {...stylex.props(styles.socialLinks)}>
          <FaGithub {...stylex.props(styles.socialIcon)} />
          <FaTwitter {...stylex.props(styles.socialIcon)} />
          <FaTelegram {...stylex.props(styles.socialIcon)} />
          <FaDiscord {...stylex.props(styles.socialIcon)} />
          <IoMail {...stylex.props(styles.socialIcon)} />
        </div>
      </div>
      <div {...stylex.props(styles.imageContainer)}>
        <Image src={CONFIG.avatar} {...stylex.props(styles.avatar)} />
      </div>
    </div>
  );
}

export default About;
