package internal

import (
	"context"

	"github.com/mark3labs/mcp-go/mcp"
	"github.com/mark3labs/mcp-go/server"
)

func registerWriteComponentTools(s *server.MCPServer, node *Node) {
	s.AddTool(mcp.NewTool("navigate_to_page",
		mcp.WithDescription("Switch the active Figma page. Provide either pageId or pageName."),
		mcp.WithString("pageId", mcp.Description("Page node ID in colon format e.g. '0:1'")),
		mcp.WithString("pageName", mcp.Description("Exact page name to navigate to")),
	), func(ctx context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
		params := map[string]interface{}{}
		if id, ok := req.GetArguments()["pageId"].(string); ok && id != "" {
			params["pageId"] = id
		}
		if name, ok := req.GetArguments()["pageName"].(string); ok && name != "" {
			params["pageName"] = name
		}
		resp, err := node.Send(ctx, "navigate_to_page", nil, params)
		return renderResponse(resp, err)
	})

	s.AddTool(mcp.NewTool("group_nodes",
		mcp.WithDescription("Group two or more nodes into a GROUP. All nodes must share the same parent."),
		mcp.WithArray("nodeIds",
			mcp.Required(),
			mcp.Description("Node IDs to group (minimum 2), in colon format e.g. ['4029:12345', '4029:12346']"),
			mcp.WithStringItems(),
		),
		mcp.WithString("name", mcp.Description("Optional name for the new group")),
	), func(ctx context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
		raw, _ := req.GetArguments()["nodeIds"].([]interface{})
		nodeIDs := toStringSlice(raw)
		params := map[string]interface{}{}
		if name, ok := req.GetArguments()["name"].(string); ok && name != "" {
			params["name"] = name
		}
		resp, err := node.Send(ctx, "group_nodes", nodeIDs, params)
		return renderResponse(resp, err)
	})

	s.AddTool(mcp.NewTool("ungroup_nodes",
		mcp.WithDescription("Ungroup one or more GROUP nodes, moving their children to the parent and removing the group."),
		mcp.WithArray("nodeIds",
			mcp.Required(),
			mcp.Description("GROUP node IDs in colon format e.g. ['4029:12345']"),
			mcp.WithStringItems(),
		),
	), func(ctx context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
		raw, _ := req.GetArguments()["nodeIds"].([]interface{})
		nodeIDs := toStringSlice(raw)
		resp, err := node.Send(ctx, "ungroup_nodes", nodeIDs, nil)
		return renderResponse(resp, err)
	})


	s.AddTool(mcp.NewTool("swap_component",
		mcp.WithDescription("Swap the main component of an existing INSTANCE node, replacing it with a different component while keeping position and size."),
		mcp.WithString("nodeId",
			mcp.Required(),
			mcp.Description("INSTANCE node ID in colon format e.g. 4029:12345"),
		),
		mcp.WithString("componentId",
			mcp.Required(),
			mcp.Description("Target COMPONENT node ID in colon format (from get_local_components)"),
		),
	), func(ctx context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
		args := req.GetArguments()
		nodeID, _ := args["nodeId"].(string)
		nodeID = NormalizeNodeID(nodeID)
		componentID, _ := args["componentId"].(string)
		componentID = NormalizeNodeID(componentID)
		params := map[string]interface{}{"componentId": componentID}
		resp, err := node.Send(ctx, "swap_component", []string{nodeID}, params)
		return renderResponse(resp, err)
	})

	s.AddTool(mcp.NewTool("create_component_instance",
		mcp.WithDescription("Create a new INSTANCE of a main COMPONENT and append it to a parent FRAME/COMPONENT/INSTANCE/PAGE, or insert in place of a placeholder node (replaceNodeId must be a direct child of parentId). Use this when swap_component cannot run because no INSTANCE exists yet (e.g. CTA placeholder inside a card component)."),
		mcp.WithString("componentId",
			mcp.Required(),
			mcp.Description("Main COMPONENT node ID in colon format (from get_local_components)"),
		),
		mcp.WithString("parentId",
			mcp.Required(),
			mcp.Description("Parent node ID that will contain the new instance (same parent as the placeholder when replacing)"),
		),
		mcp.WithString("replaceNodeId",
			mcp.Description("Optional: FRAME/GROUP/RECTANGLE etc. to remove after inserting the instance at the same index; must be a direct child of parentId"),
		),
		mcp.WithNumber("x", mcp.Description("When replaceNodeId is omitted: x position of the new instance (default 0)")),
		mcp.WithNumber("y", mcp.Description("When replaceNodeId is omitted: y position of the new instance (default 0)")),
		mcp.WithBoolean("copySize", mcp.Description("When replaceNodeId is set: resize instance to replaced node width/height (default true)")),
	), func(ctx context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
		args := req.GetArguments()
		params := map[string]interface{}{}
		if id, ok := args["componentId"].(string); ok && id != "" {
			params["componentId"] = NormalizeNodeID(id)
		}
		if id, ok := args["parentId"].(string); ok && id != "" {
			params["parentId"] = NormalizeNodeID(id)
		}
		if id, ok := args["replaceNodeId"].(string); ok && id != "" {
			params["replaceNodeId"] = NormalizeNodeID(id)
		}
		if v, ok := args["x"].(float64); ok {
			params["x"] = v
		}
		if v, ok := args["y"].(float64); ok {
			params["y"] = v
		}
		if v, ok := args["copySize"].(bool); ok {
			params["copySize"] = v
		}
		resp, err := node.Send(ctx, "create_component_instance", nil, params)
		return renderResponse(resp, err)
	})

	s.AddTool(mcp.NewTool("detach_instance",
		mcp.WithDescription("Detach one or more component instances, converting them to plain frames. The link to the main component is broken; all visual properties are preserved."),
		mcp.WithArray("nodeIds",
			mcp.Required(),
			mcp.Description("INSTANCE node IDs in colon format e.g. ['4029:12345']"),
			mcp.WithStringItems(),
		),
	), func(ctx context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
		raw, _ := req.GetArguments()["nodeIds"].([]interface{})
		nodeIDs := toStringSlice(raw)
		for i, id := range nodeIDs {
			nodeIDs[i] = NormalizeNodeID(id)
		}
		resp, err := node.Send(ctx, "detach_instance", nodeIDs, nil)
		return renderResponse(resp, err)
	})
}
