import { useAppSelector } from "@/redux/hooks";
import { DefaultNavbar } from "@/ui/components";

interface Props {
  children?: React.ReactNode;
}
export default function UserLayout({ children }: Props) {
  const theme = useAppSelector((state) => state.theme.themeToggle);
  return (
    <div
      className={`text-foreground bg-background relative flex flex-col ${theme ? "dark" : "light"}`}
    >
      <DefaultNavbar />
      <main className=" container mx-auto max-w-7xl px-6 flex-grow pt-9">
        {children}
      </main>
      <footer className="w-full flex items-center justify-center py-3"></footer>
    </div>
  );
}
