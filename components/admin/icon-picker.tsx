"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building,
  Code,
  Database,
  Globe,
  GraduationCap,
  Heart,
  Home,
  Laptop,
  MapPin,
  Rocket,
  Server,
  Shield,
  Star,
  Target,
  User,
  Zap,
  Coffee,
  Briefcase,
  Award,
  BookOpen,
  Camera,
  Cloud,
  Cog,
  DollarSign,
  FileText,
  Gamepad2,
  Lightbulb,
  Music,
  Palette,
  Phone,
  Search,
  Settings,
  Smartphone,
  Truck,
  Video,
  Wifi,
  X
} from "lucide-react";

// Icon mapping for display
const lucideIcons = {
  Building,
  Code,
  Database,
  Globe,
  GraduationCap,
  Heart,
  Home,
  Laptop,
  MapPin,
  Rocket,
  Server,
  Shield,
  Star,
  Target,
  User,
  Zap,
  Coffee,
  Briefcase,
  Award,
  BookOpen,
  Camera,
  Cloud,
  Cog,
  DollarSign,
  FileText,
  Gamepad2,
  Lightbulb,
  Music,
  Palette,
  Phone,
  Search,
  Settings,
  Smartphone,
  Truck,
  Video,
  Wifi,
  X
};

const emojiOptions = [
  "🏢", "💼", "🎓", "🚀", "⚡", "🔧", "💻", "🎯", "🌟", "📚",
  "🎨", "🏆", "📱", "🌐", "🔐", "📊", "🎮", "🎵", "📷", "☁️",
  "💡", "🔍", "📞", "🚛", "🎬", "📝", "💰", "⚙️", "🎪", "🔥"
];

const lucideIconNames = Object.keys(lucideIcons) as (keyof typeof lucideIcons)[];

interface IconPickerProps {
  selectedIcon: string;
  onSelectIcon: (icon: string) => void;
  className?: string;
}

export function IconPicker({ selectedIcon, onSelectIcon, className }: IconPickerProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLucideIcons = lucideIconNames.filter(iconName =>
    iconName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredEmojis = emojiOptions.filter(emoji => 
    // Simple emoji filtering - could be enhanced with tags
    true
  );

  return (
    <div className={className}>
      <Tabs defaultValue="emojis" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="emojis">Emojis</TabsTrigger>
          <TabsTrigger value="icons">Icons</TabsTrigger>
        </TabsList>

        <TabsContent value="emojis" className="space-y-4">
          <div className="grid grid-cols-6 gap-2 max-h-48 overflow-y-auto">
            {filteredEmojis.map((emoji) => (
              <Button
                key={emoji}
                type="button"
                variant={selectedIcon === emoji ? "default" : "outline"}
                size="sm"
                onClick={() => onSelectIcon(emoji)}
                className="h-10 w-10 text-lg p-0"
              >
                {emoji}
              </Button>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="icons" className="space-y-4">
          <Input
            placeholder="Search icons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="grid grid-cols-6 gap-2 max-h-48 overflow-y-auto">
            {filteredLucideIcons.map((iconName) => {
              const IconComponent = lucideIcons[iconName];
              const iconValue = `lucide:${iconName}`;
              
              return (
                <Button
                  key={iconName}
                  type="button"
                  variant={selectedIcon === iconValue ? "default" : "outline"}
                  size="sm"
                  onClick={() => onSelectIcon(iconValue)}
                  className="h-10 w-10 p-0"
                  title={iconName}
                >
                  <IconComponent className="h-4 w-4" />
                </Button>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Helper component to render icons consistently
interface IconDisplayProps {
  icon: string;
  className?: string;
}

export function IconDisplay({ icon, className = "h-5 w-5" }: IconDisplayProps) {
  // Handle legacy icon names (like "FaDatabase")
  if (icon.startsWith('Fa') || icon.startsWith('fa')) {
    // Convert common legacy icons to emojis
    const legacyIconMap: Record<string, string> = {
      FaDatabase: "🗄️",
      FaReact: "⚛️",
      FaAnchor: "⚓",
      FaDotCircle: "🔵",
      faDatabase: "🗄️",
      faReact: "⚛️",
      faAnchor: "⚓",
      faDotCircle: "🔵"
    };
    
    const mappedIcon = legacyIconMap[icon];
    if (mappedIcon) {
      return <span className={`text-xl ${className}`}>{mappedIcon}</span>;
    }
    
    // Fallback for unmapped legacy icons
    return <span className={`text-xl ${className}`}>🏢</span>;
  }

  // Handle lucide icons
  if (icon.startsWith('lucide:')) {
    const iconName = icon.replace('lucide:', '') as keyof typeof lucideIcons;
    const IconComponent = lucideIcons[iconName];
    
    if (IconComponent) {
      return <IconComponent className={className} />;
    }
  }

  // Handle emojis
  if (icon.length <= 4) {
    return <span className={`text-xl ${className}`}>{icon}</span>;
  }

  // Fallback
  return <span className={`text-xl ${className}`}>🏢</span>;
} 