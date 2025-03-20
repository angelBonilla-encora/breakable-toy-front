import { themeToggle } from "@/redux/slices/ui";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from "@heroui/react";
import { DarkTheme, LightTheme } from "../icons";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

export const DefaultNavbar = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.themeToggle);

  return (
    <Navbar shouldHideOnScroll>
      <NavbarBrand>
        <Link href="/">
          <img src="/encora-logo.webp" className="w-12 h-12" />
          <p className="font-bold text-inherit ml-4">
            INVENTORY | BREAKABLE TOY
          </p>
        </Link>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Button
            isIconOnly
            as={Link}
            onPress={() => dispatch(themeToggle())}
            variant="flat"
          >
            {theme ? <DarkTheme /> : <LightTheme />}
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};
