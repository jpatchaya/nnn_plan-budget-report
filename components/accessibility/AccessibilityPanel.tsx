"use client"

import { useAccessibilitySettings } from "@/contexts/accessibility-context"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Accessibility, RotateCcw } from "lucide-react"

export function AccessibilityPanel() {
  const { settings, updateSettings, resetSettings } = useAccessibilitySettings()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          aria-label="Accessibility settings"
        >
          <Accessibility className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Accessibility Settings</SheetTitle>
          <SheetDescription>
            Customize your viewing experience for better accessibility
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Font Size */}
          <div className="space-y-3">
            <Label>Font Size</Label>
            <RadioGroup
              value={settings.fontSize}
              onValueChange={(value) => 
                updateSettings({ fontSize: value as any })
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="small" id="font-small" />
                <Label htmlFor="font-small" className="font-normal">
                  Small
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="font-medium" />
                <Label htmlFor="font-medium" className="font-normal">
                  Medium (Default)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="large" id="font-large" />
                <Label htmlFor="font-large" className="font-normal">
                  Large
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="extra-large" id="font-extra-large" />
                <Label htmlFor="font-extra-large" className="font-normal">
                  Extra Large
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* High Contrast */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="high-contrast">High Contrast</Label>
              <p className="text-sm text-muted-foreground">
                Increase contrast for better visibility
              </p>
            </div>
            <Switch
              id="high-contrast"
              checked={settings.highContrast}
              onCheckedChange={(checked) => 
                updateSettings({ highContrast: checked })
              }
            />
          </div>

          {/* Reduced Motion */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="reduced-motion">Reduced Motion</Label>
              <p className="text-sm text-muted-foreground">
                Minimize animations and transitions
              </p>
            </div>
            <Switch
              id="reduced-motion"
              checked={settings.reducedMotion}
              onCheckedChange={(checked) => 
                updateSettings({ reducedMotion: checked })
              }
            />
          </div>

          {/* Screen Reader Mode */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="screen-reader">Screen Reader Mode</Label>
              <p className="text-sm text-muted-foreground">
                Optimize for screen reader usage
              </p>
            </div>
            <Switch
              id="screen-reader"
              checked={settings.screenReaderMode}
              onCheckedChange={(checked) => 
                updateSettings({ screenReaderMode: checked })
              }
            />
          </div>

          {/* Keyboard Navigation */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="keyboard-nav">Enhanced Keyboard Navigation</Label>
              <p className="text-sm text-muted-foreground">
                Enable additional keyboard shortcuts
              </p>
            </div>
            <Switch
              id="keyboard-nav"
              checked={settings.keyboardNavigation}
              onCheckedChange={(checked) => 
                updateSettings({ keyboardNavigation: checked })
              }
            />
          </div>

          {/* Reset Button */}
          <Button
            onClick={resetSettings}
            variant="outline"
            className="w-full"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset to Defaults
          </Button>

          {/* Keyboard Shortcuts Info */}
          <div className="border-t pt-4">
            <h3 className="font-medium mb-2">Keyboard Shortcuts</h3>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p><kbd>Tab</kbd> / <kbd>Shift+Tab</kbd> - Navigate elements</p>
              <p><kbd>Enter</kbd> / <kbd>Space</kbd> - Activate buttons</p>
              <p><kbd>Esc</kbd> - Close dialogs</p>
              <p><kbd>Alt+H</kbd> - Toggle high contrast</p>
              <p><kbd>Ctrl/Cmd + +/-</kbd> - Adjust font size</p>
              <p><kbd>Shift+/</kbd> - Skip to main content</p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}