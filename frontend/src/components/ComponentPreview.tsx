import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  PaintBucket,
  Check,
  Save,
  Palette,
  Undo,
  Lock,
  Unlock,
  Copy,
} from "lucide-react";
import { toast } from "sonner";
import { DialogHeader, DialogTitle } from "./ui/dialog";

// Mock implementation of the zod schema
const validateHexColor = (color) => {
  const regex = /^#[0-9A-F]{6}$/i;
  return regex.test(color);
};

const ComponentPreview = ({
  initialTheme = {
    background_color: "#FFFFFF",
    primary_color: "#3B82F6",
    secondary_color: "#10B981",
    surface_color: "#F3F4F6",
    text_color: "#1F2937",
    theme_id: 1,
  },
}) => {
  const [theme, setTheme] = useState(initialTheme);
  const [errors, setErrors] = useState({});
  const [isLocked, setIsLocked] = useState({
    background_color: false,
    primary_color: false,
    secondary_color: false,
    surface_color: false,
    text_color: false,
  });

  const handleColorChange = (field, value) => {
    setTheme({
      ...theme,
      [field]: value,
    });

    // Validate color
    if (!validateHexColor(value)) {
      setErrors({
        ...errors,
        [field]: "Invalid hex color code",
      });
    } else {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const toggleLock = (field) => {
    setIsLocked({
      ...isLocked,
      [field]: !isLocked[field],
    });
  };

  const resetTheme = () => {
    setTheme(initialTheme);
    setErrors({});
  };

  const saveTheme = () => {
    // Check all colors are valid
    let valid = true;
    const newErrors = {};

    Object.entries(theme).forEach(([key, value]) => {
      if (key.includes("color") && !validateHexColor(value)) {
        valid = false;
        newErrors[key] = "Invalid hex color code";
      }
    });

    setErrors(newErrors);

    if (valid) {
      console.log("Saving theme:", theme);
      // This would normally be an API call
      setTimeout(() => {
        toast.success("Theme saved successfully");
      }, 500);
    }
  };

  const generatePreviewStyle = () => {
    return {
      backgroundColor: theme.background_color,
      color: theme.text_color,
      borderColor: theme.primary_color,
    };
  };

  const generateButtonStyle = () => {
    return {
      backgroundColor: theme.primary_color,
      color: "#FFFFFF",
    };
  };

  const generateAccentStyle = () => {
    return {
      backgroundColor: theme.secondary_color,
      color: "#FFFFFF",
    };
  };

  const generateSurfaceStyle = () => {
    return {
      backgroundColor: theme.surface_color,
      color: theme.text_color,
      border: `1px solid ${
        theme.surface_color === theme.background_color
          ? "#E5E7EB"
          : theme.surface_color
      }`,
    };
  };

  // Generate complementary color options
  const colorOptions = [
    "#FF6B6B",
    "#4ECDC4",
    "#1A535C",
    "#FF9F1C",
    "#E71D36",
    "#011627",
    "#FDFFFC",
    "#2EC4B6",
    "#E71D36",
    "#FF9F1C",
  ];

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <DialogHeader>
        <div className="flex justify-between items-center">
          <div>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Palette className="h-6 w-6" />
              Theme Editor
            </DialogTitle>
            <CardDescription>
              Customize your application&apos;s color scheme
            </CardDescription>
          </div>
          <Badge variant="outline">Theme #{theme.theme_id}</Badge>
        </div>

        {Object.keys(errors).length > 0 && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Please fix the following errors:
              <ul className="list-disc pl-5 mt-2">
                {Object.entries(errors).map(([key, value]) => (
                  <li key={key}>
                    {key.replace("_", " ")}: {value as string}
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="colors" className="w-full">
          <TabsList className="grid grid-cols-2 w-full mb-4">
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="colors" className="space-y-6">
            <ScrollArea className="h-[400px] pr-4">
              {/* Color Inputs */}
              {[
                "background_color",
                "primary_color",
                "secondary_color",
                "surface_color",
                "text_color",
              ].map((field) => (
                <div key={field} className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <Label htmlFor={field} className="text-base capitalize">
                      {field.replace("_", " ")}
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleLock(field)}
                            className="h-8 w-8"
                          >
                            {isLocked[field] ? (
                              <Lock className="h-4 w-4" />
                            ) : (
                              <Unlock className="h-4 w-4" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {isLocked[field]
                            ? "Unlock this color"
                            : "Lock this color"}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="flex gap-3 items-center">
                    <div
                      className="w-10 h-10 rounded border border-gray-300"
                      style={{ backgroundColor: theme[field] }}
                    />
                    <div className="flex-1">
                      <Input
                        id={field}
                        value={theme[field]}
                        onChange={(e) =>
                          handleColorChange(field, e.target.value)
                        }
                        disabled={isLocked[field]}
                        className={errors[field] ? "border-red-500" : ""}
                      />
                      {errors[field] && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors[field]}
                        </p>
                      )}
                    </div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={isLocked[field]}
                        >
                          <PaintBucket className="h-4 w-4 mr-1" /> Select
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-64">
                        <div className="grid grid-cols-5 gap-2">
                          {colorOptions.map((color) => (
                            <Button
                              key={color}
                              className="w-8 h-8 p-0"
                              style={{ backgroundColor: color }}
                              onClick={() => handleColorChange(field, color)}
                            >
                              {theme[field] === color && (
                                <Check className="h-3 w-3 text-white" />
                              )}
                            </Button>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="mt-2">
                    <Slider
                      disabled={isLocked[field]}
                      min={0}
                      max={255}
                      step={1}
                      value={[parseInt(theme[field].slice(1, 3), 16)]}
                      onValueChange={(value) => {
                        const r = value[0].toString(16).padStart(2, "0");
                        const g = theme[field].slice(3, 5);
                        const b = theme[field].slice(5, 7);
                        handleColorChange(field, `#${r}${g}${b}`);
                      }}
                    />
                  </div>

                  <Separator className="my-4" />
                </div>
              ))}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="preview">
            <div className="space-y-6">
              <Card className="overflow-hidden" style={generatePreviewStyle()}>
                <CardHeader style={generateSurfaceStyle()}>
                  <CardTitle>Preview Card</CardTitle>
                  <CardDescription style={{ color: theme.text_color + "99" }}>
                    This shows how your theme will look
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Sample Text</Label>
                      <Badge style={generateAccentStyle()}>New</Badge>
                    </div>

                    <div className="grid gap-2">
                      <Input placeholder="Sample input field" />

                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                          <SelectItem value="option1">Option 1</SelectItem>
                          <SelectItem value="option2">Option 2</SelectItem>
                          <SelectItem value="option3">Option 3</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox id="terms" />
                      <label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Accept terms and conditions
                      </label>
                    </div>

                    <div className="flex space-x-2">
                      <Button style={generateButtonStyle()}>
                        Primary Button
                      </Button>
                      <Button
                        variant="outline"
                        style={{
                          borderColor: theme.primary_color,
                          color: theme.primary_color,
                        }}
                      >
                        Secondary Button
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter
                  style={generateSurfaceStyle()}
                  className="flex justify-between"
                >
                  <div className="flex items-center space-x-2">
                    <Avatar>
                      <AvatarImage src="/api/placeholder/40/40" alt="Avatar" />
                      <AvatarFallback
                        style={{ backgroundColor: theme.secondary_color }}
                      >
                        TS
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">Theme Style</p>
                      <p className="text-xs opacity-70">Sample user</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <ChevronDown />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Profile</DropdownMenuItem>
                      <DropdownMenuItem>Settings</DropdownMenuItem>
                      <DropdownMenuItem>Logout</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </DialogHeader>

      <CardFooter className="flex justify-between border-t p-4">
        <div className="flex items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    navigator.clipboard.writeText(
                      JSON.stringify(theme, null, 2)
                    )
                  }
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy theme JSON</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={resetTheme}>
            <Undo className="h-4 w-4 mr-1" /> Reset
          </Button>
          <Button onClick={saveTheme}>
            <Save className="h-4 w-4 mr-1" /> Save Theme
          </Button>
        </div>
      </CardFooter>
    </div>
  );
};

export default ComponentPreview;
