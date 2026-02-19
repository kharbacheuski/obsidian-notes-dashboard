import {FrontMatterCache, TFile} from "obsidian"
declare global {
	interface KanbanColumn {
		name: string;
		pages: TFile[];
	}

	interface KanbanAbstractColumn {
		name: string;
		pages: string[];
	}

	interface DashboardFrontmatter extends FrontMatterCache {
		dashboard?: boolean;
		layout?: "kanban";
		columns?: KanbanAbstractColumn[];
		sort?: "modified" | "created" | "name";
	}
}
