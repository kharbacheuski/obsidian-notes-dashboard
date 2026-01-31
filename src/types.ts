import {FrontMatterCache} from "obsidian"
declare global {
	interface KanbanColumn {
		name: string;
		pages?: string[];
	}

	interface DashboardFrontmatter extends FrontMatterCache {
		dashboard?: boolean;
		layout?: "kanban";
		columns?: KanbanColumn[];
		sort?: "modified" | "created" | "name";
	}
}
