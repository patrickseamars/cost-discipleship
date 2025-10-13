# UI/UX Mockup System

This project includes a comprehensive mockup system that allows you to experiment with different UI/UX designs without affecting the main application. The system is designed to be safe, isolated, and easy to use.

## 🎯 Purpose

The mockup system enables you to:
- Test different layouts and design approaches
- Experiment with color schemes and themes  
- Try out new component designs
- Prototype interactions and animations
- Compare design variations side-by-side
- Get feedback on designs before implementing them in the main app

## 📁 Structure

```
src/mockups/
├── pages/              # Main mockup pages
│   ├── MockupHub.tsx   # Central hub for all mockups
│   └── DesignPlayground.tsx  # Component testing environment
├── variants/           # Different design variants
│   ├── LayoutVariant1.tsx    # Modern card-based layout
│   ├── ColorVariant1.tsx     # Warm earth tones theme
│   └── ...                   # Future variants
└── components/         # Reusable mockup components (if needed)
```

## 🚀 Getting Started

### Accessing the Mockup System

1. **From Main App**: Click the "UI Mockups" button on the homepage
2. **Direct URL**: Navigate to `/mockups` in your browser
3. **From Sections**: Use the mockup link in the main navigation

### Using the Mockup Hub

The Mockup Hub (`/mockups`) is your central dashboard for all design experiments:

- **Current Application**: Links back to the production version
- **Design Variants**: Grid of available mockups with status indicators
- **Status Types**:
  - `Active`: Ready to view and interact with
  - `Draft`: Work in progress but viewable
  - `Concept`: Planned but not yet implemented

### Design System Playground

The playground (`/mockups/playground`) provides an interactive environment for testing:

- **Components Tab**: Test UI components with sample data
- **Colors Tab**: Explore color palettes and themes
- **Typography Tab**: Experiment with fonts and text styles
- **Interactions Tab**: Test hover effects and animations

## ✨ Creating New Mockups

### Step 1: Create Your Variant

Create a new file in `src/mockups/variants/`:

```tsx
// src/mockups/variants/YourVariant.tsx
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const YourVariant = () => {
  return (
    <div className="min-h-screen bg-your-background">
      {/* Always include back navigation */}
      <div className="border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto p-4">
          <Link to="/mockups">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Hub
            </Button>
          </Link>
        </div>
      </div>

      {/* Your mockup content here */}
      <div className="max-w-6xl mx-auto p-6">
        {/* Experiment with your designs */}
      </div>
    </div>
  );
};

export default YourVariant;
```

### Step 2: Add to MockupHub

Update `src/mockups/pages/MockupHub.tsx`:

```tsx
// Add to the variants array
{
  id: "your-variant",
  title: "Your Variant Name",
  description: "Description of what this variant explores",
  status: "active", // or "draft" or "concept"
  path: "/mockups/your-variant",
  icon: YourIcon, // Import from lucide-react
  color: "bg-your-color"
}
```

### Step 3: Add Route

Update `src/App.tsx`:

```tsx
// Add import
import YourVariant from "./mockups/variants/YourVariant";

// Add route
<Route path="/mockups/your-variant" element={<YourVariant />} />
```

## 🎨 Design Guidelines

### Safe Experimentation

- **Use existing components**: Leverage the shadcn/ui component library
- **Preserve functionality**: Focus on visual changes, not breaking features
- **Include navigation**: Always provide a way back to the mockup hub
- **Use semantic naming**: Make variant names descriptive and clear

### Status Guidelines

- **Active**: Fully functional mockup ready for feedback
- **Draft**: Partially complete but demonstrates the concept
- **Concept**: Placeholder for future development

### Component Reuse

- Import components from `@/components/ui/` for consistency
- Use the same data structures as the main app when possible
- Leverage Tailwind classes for styling
- Consider accessibility in your designs

## 🔄 Workflow

### Design Process

1. **Plan**: Define what you want to test (layout, colors, interactions)
2. **Create**: Build your variant following the guidelines above
3. **Test**: Use the design playground to experiment with details
4. **Iterate**: Make changes and test different approaches
5. **Gather Feedback**: Share the mockup URL with stakeholders
6. **Implement**: Apply successful designs to the main application

### Testing Your Mockups

1. **Build the project**: Run `npm run build` to ensure no errors
2. **Test in development**: Run `npm run dev` and navigate to your mockup
3. **Test responsiveness**: Check mobile, tablet, and desktop layouts
4. **Verify navigation**: Ensure all links work correctly
5. **Cross-browser testing**: Test in different browsers

## 📊 Best Practices

### Do's

✅ **Test early and often**: Create mockups before major redesigns
✅ **Use real content**: Include actual text and data from your app
✅ **Consider all screen sizes**: Design for mobile, tablet, and desktop
✅ **Document decisions**: Add comments explaining design choices
✅ **Seek feedback**: Share mockups with users and stakeholders

### Don'ts

❌ **Don't break the main app**: Keep mockups isolated
❌ **Don't duplicate too much code**: Reuse components when possible
❌ **Don't ignore accessibility**: Maintain proper contrast and navigation
❌ **Don't forget cleanup**: Remove unused mockups periodically
❌ **Don't skip testing**: Always verify your mockups work correctly

## 🛠️ Advanced Features

### Custom Themes

Create theme objects for consistent styling:

```tsx
const customTheme = {
  colors: {
    primary: "#your-primary",
    secondary: "#your-secondary",
    // ...
  },
  fonts: {
    // custom fonts
  }
};
```

### Interactive Prototypes

Add state and interactions to test user flows:

```tsx
const [currentStep, setCurrentStep] = useState(1);
const [userInput, setUserInput] = useState("");
```

### Data Integration

Use actual app data for realistic mockups:

```tsx
// Import real data files
import dailyExercisesData from "@/data/daily-exercises.json";
```

## 🚀 Deployment

Mockups are included in the main build and deploy with the application. They're accessible in production but won't interfere with the main user experience.

### Environment Considerations

- **Development**: Full access to all mockups
- **Production**: Consider hiding concept/draft mockups from users
- **Staging**: Perfect for stakeholder reviews

## 🎯 Examples

Check out the existing mockups for inspiration:

- **Layout Variant 1**: Modern card-based design with enhanced visual hierarchy
- **Color Variant 1**: Warm earth tones for a spiritual, welcoming feel
- **Design Playground**: Interactive component testing environment

## 📝 Changelog

Keep track of mockup changes:

- **v1.0**: Initial mockup system with hub and playground
- **v1.1**: Added layout and color variants
- **v1.2**: Enhanced navigation and documentation

---

## 🤝 Contributing

When adding new mockups:

1. Follow the naming conventions
2. Include proper navigation
3. Update this documentation
4. Test thoroughly
5. Get feedback before finalizing

This mockup system empowers you to innovate safely while maintaining the integrity of your main application. Happy designing! 🎨