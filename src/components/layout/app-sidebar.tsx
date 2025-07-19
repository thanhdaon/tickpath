import { Link } from "@tanstack/react-router";
import {
  Box,
  ContactRound,
  FolderKanban,
  Github,
  HelpCircle,
  Inbox,
  UserRound,
} from "lucide-react";
import { OrgSwitcher } from "~/components/layout/org-switcher";
import { Button } from "~/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <OrgSwitcher />
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavInbox />
        <NavWorkspace />
      </SidebarContent>
      <SidebarFooter className="flex flex-row w-full justify-between">
        <Button size="icon" variant="outline">
          <HelpCircle className="size-4" />
        </Button>
        <Button size="icon" variant="link" asChild>
          <a href="https://github.com/thanhdaon/tickpath" target="_blank">
            <Github className="size-4" />
          </a>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}

function NavInbox() {
  const items = [
    { name: "Inbox", url: "/", icon: Inbox },
    { name: "My issues", url: "/", icon: FolderKanban },
  ];
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <Link to={item.url}>
                <Inbox />
                <span>{item.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

export function NavWorkspace() {
  const items = [
    { name: "Teams", url: "/", icon: ContactRound },
    { name: "Projects", url: "/", icon: Box },
    { name: "Members", url: "/", icon: UserRound },
  ];

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Workspace</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <Link to={item.url}>
                <item.icon />
                <span>{item.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
