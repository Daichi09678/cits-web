<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Frontend page isolation

- Follow the frontend branch and page scope mapping in `CONTRIBUTING.md`, section 7.
- Keep page-specific components in `src/components/pages/<area>/` and page-specific
  styles in CSS Modules or local component classes. Migrate existing components only
  when needed for the requested change.
- Before editing a shared component, find its consumers. For a change requested on
  one page, preserve other consumers through an opt-in prop/variant or a page-specific
  component. Do not change global CSS or shared defaults just to fix one page.
- Shared layout, theme, and component changes require checking the affected pages.
- Git branches isolate committed work, not runtime data or the effects of shared code
  after merging. Do not promise page isolation solely because branches exist.
