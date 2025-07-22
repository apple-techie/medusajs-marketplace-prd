# Figma Integration Workflow

## Overview

This document outlines the workflow for integrating Figma designs into the MedusaJS marketplace codebase using both the Figma VS Code extension and Figma MCP (Model Context Protocol).

## Tools Setup

### 1. Figma VS Code Extension
- **Purpose**: Browse designs, inspect properties, export assets
- **Best for**: Quick reference, asset export, CSS values

### 2. Figma MCP (via Claude Code)
- **Purpose**: Generate complete React components
- **Best for**: Full component generation, TypeScript interfaces

## Recommended Workflow

### Phase 1: Design Inspection (VS Code Extension)
1. Open Figma file in VS Code sidebar
2. Browse to component
3. Note structure and hierarchy
4. Export any required assets
5. Copy design tokens if needed

### Phase 2: Code Generation (Figma MCP)
1. Open Figma desktop app
2. Select single component
3. Use Claude Code to generate React component
4. Review and customize generated code

### Phase 3: Integration
1. Add TypeScript interfaces for props
2. Connect to MedusaJS data models
3. Verify styling matches design
4. Create Storybook story
5. Write tests

## Component Processing Checklist

For each production-ready component:

- [ ] Inspect in VS Code Figma extension
- [ ] Export required assets
- [ ] Generate code via Figma MCP
- [ ] Create TypeScript interfaces
- [ ] Integrate with MedusaJS models
- [ ] Add to component library
- [ ] Create Storybook story
- [ ] Write unit tests
- [ ] Update component tracker

## Example: ProductCard Component

```typescript
// 1. VS Code Extension: Inspect and export
// - Export product placeholder image
// - Note spacing: 16px padding
// - Border radius: 12px
// - Shadow: 0px 2px 8px rgba(0,0,0,0.08)

// 2. Figma MCP: Generate component
// - Select ProductCard in Figma desktop
// - Generate React component with Tailwind

// 3. Integration: Connect to MedusaJS
import { Product } from "@medusajs/medusa";

interface ProductCardProps {
  product: Product;
  onAddToCart?: () => void;
  onToggleFavorite?: () => void;
}

// ... rest of implementation
```

## Asset Management

### Export Settings
- **Images**: PNG 2x for retina
- **Icons**: SVG for scalability
- **Export to**: `src/assets/figma/[component-name]/`

### Naming Convention
- `icon-[name].svg` for icons
- `img-[name]@2x.png` for images
- `bg-[name].jpg` for backgrounds

## Tips for Efficiency

1. **Batch Processing**: Group similar components
2. **Design Tokens First**: Extract all tokens before components
3. **Component Dependencies**: Build atoms before molecules
4. **Version Control**: Commit each component separately
5. **Documentation**: Update component library docs

## Troubleshooting

### VS Code Extension Issues
- Can't see Figma file: Re-authenticate
- Slow loading: Check internet connection
- Missing layers: Refresh the file

### MCP Issues
- "Nothing selected": Select one component in Figma desktop
- "Multiple nodes": Deselect with Cmd/Ctrl+Click
- Connection lost: Restart Figma desktop

## Next Steps

1. Process all atomic components first
2. Move to molecules (cards, forms)
3. Build organisms (headers, sidebars)
4. Complete page templates
5. Set up continuous sync workflow