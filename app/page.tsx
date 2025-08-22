"use client"

import { Section } from "@/components/section"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { MeshGradient } from "@paper-design/shaders-react"
import { Code2, Copy, Download, Eye, EyeOff, Heart, Palette, Plus, Settings, Shuffle, Sparkles, Trash2 } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { useCallback, useState } from "react"
import { toast } from "sonner"

const DEFAULT_COLORS = ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4"]

const GRADIENT_PRESETS = [
  {
    name: "Sunset Vibes",
    colors: ["#ff6b6b", "#ffa726", "#ff7043", "#ff5722"],
    description: "Warm sunset colors"
  },
  {
    name: "Ocean Breeze",
    colors: ["#4ecdc4", "#45b7d1", "#42a5f5", "#2196f3"],
    description: "Cool ocean tones"
  },
  {
    name: "Forest Dream",
    colors: ["#96ceb4", "#81c784", "#66bb6a", "#4caf50"],
    description: "Natural forest greens"
  },
  {
    name: "Purple Haze",
    colors: ["#ba68c8", "#9c27b0", "#7b1fa2", "#4a148c"],
    description: "Deep purple gradient"
  },
  {
    name: "Golden Hour",
    colors: ["#ffd54f", "#ffb74d", "#ff9800", "#f57c00"],
    description: "Warm golden tones"
  },
  {
    name: "Aurora",
    colors: ["#64b5f6", "#81c784", "#ffb74d", "#f06292"],
    description: "Northern lights inspired"
  }
]

interface GradientConfig {
  colors: string[]
  distortion: number
  speed: number
  swirl: number
  width: string
  height: string
  position: "fixed" | "absolute" | "relative"
  zIndex: number
}

export default function MeshGradientGenerator() {
  const [config, setConfig] = useState<GradientConfig>({
    colors: [...DEFAULT_COLORS],
    distortion: 0.6,
    speed: 0.15,
    swirl: 0.6,
    width: "100vw",
    height: "100vh",
    position: "fixed",
    zIndex: -1,
  })

  const [showPreview, setShowPreview] = useState(true)
  const [previewMode, setPreviewMode] = useState<"fullscreen" | "container">("fullscreen")

  const updateConfig = useCallback((updates: Partial<GradientConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }))
  }, [])

  const addColor = useCallback(() => {
    if (config.colors.length < 8) {
      const newColor =
        "#" +
        Math.floor(Math.random() * 16777215)
          .toString(16)
          .padStart(6, "0")
      updateConfig({ colors: [...config.colors, newColor] })
    }
  }, [config.colors, updateConfig])

  const removeColor = useCallback(
    (index: number) => {
      if (config.colors.length > 2) {
        const newColors = config.colors.filter((_, i) => i !== index)
        updateConfig({ colors: newColors })
      }
    },
    [config.colors, updateConfig],
  )

  const updateColor = useCallback(
    (index: number, color: string) => {
      const newColors = [...config.colors]
      newColors[index] = color
      updateConfig({ colors: newColors })
    },
    [config.colors, updateConfig],
  )

  const applyPreset = useCallback((preset: typeof GRADIENT_PRESETS[0]) => {
    updateConfig({ colors: [...preset.colors] })
    toast(`Applied "${preset.name}" preset!`)
  }, [updateConfig])

  const randomizeGradient = useCallback(() => {
    const randomPreset = GRADIENT_PRESETS[Math.floor(Math.random() * GRADIENT_PRESETS.length)]
    applyPreset(randomPreset)
  }, [applyPreset])

  // Generate component code
  const generateCode = useCallback(() => {
    const colorsArray = config.colors.map((c) => `'${c}'`).join(", ")
    const styleProps = []

    if (previewMode === "fullscreen") {
      styleProps.push(`position: '${config.position}'`)
      if (config.position === "fixed") {
        styleProps.push(`inset: 0`)
      }
      styleProps.push(`width: '${config.width}'`)
      styleProps.push(`height: '${config.height}'`)
      styleProps.push(`zIndex: ${config.zIndex}`)
    } else {
      styleProps.push(`width: '${config.width}'`)
      styleProps.push(`height: '${config.height}'`)
    }

    return `import { MeshGradient } from '@paper-design/shaders-react';

export default function CustomMeshGradient() {
  return (
    <MeshGradient
      colors={[${colorsArray}]}
      distortion={${config.distortion}}
      speed={${config.speed}}
      swirl={${config.swirl}}
      style={{
        ${styleProps.join(",\n        ")}
      }}
    />
  );
}`
  }, [config, previewMode])

  const copyCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(generateCode())
      toast("Code copied!")
    } catch (_err) {
      toast("Copy failed")
    }
  }, [generateCode])

  const downloadCode = useCallback(() => {
    const code = generateCode()
    const blob = new Blob([code], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "MeshGradient.tsx"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast("File downloaded!")
  }, [generateCode])

  return (
    <div className="min-h-screen bg-background">
      {/* Background Gradient */}
      <AnimatePresence>
        {showPreview && previewMode === "fullscreen" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0"
          >
            <MeshGradient
              colors={config.colors}
              distortion={config.distortion}
              speed={config.speed}
              swirl={config.swirl}
              style={{
                position: config.position,
                inset: 0,
                width: config.width,
                height: config.height,
                zIndex: config.zIndex,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10">
        {/* Hero Header */}
        <Section className="px-6 pt-12 pb-8 grid gap-4">
          <div className="max-w-6xl mx-auto text-center">
            <Section delay={0.1} className="flex flex-wrap items-center justify-center gap-4">
              <Button
                onClick={randomizeGradient}
                className="group relative overflow-hidden bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <Shuffle className="w-4 h-4 mr-2" />
                Surprise Me
              </Button>

              <Button
                variant="outline"
                onClick={() => setShowPreview(!showPreview)}
                className="group"
              >
                {showPreview ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                {showPreview ? "Hide Preview" : "Show Preview"}
              </Button>

              <Button
                variant="outline"
                onClick={() => setPreviewMode(prev => prev === "fullscreen" ? "container" : "fullscreen")}
                className="group"
              >
                <Settings className="w-4 h-4 mr-2" />
                {previewMode === "fullscreen" ? "Container Mode" : "Fullscreen Mode"}
              </Button>

              <ThemeToggle />
            </Section>
          </div>
        </Section>

        {/* Main Content */}
        <div className="px-6 pb-12">
          <div className="max-w-6xl mx-auto">
            <Section delay={0.4} className="grid lg:grid-cols-2 gap-8">
              {/* Controls Panel */}
              <Section delay={0.5}>
                <Card className="bg-card/95 backdrop-blur-sm border-2 hover:border-primary/20 transition-colors">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="w-5 h-5 text-primary" />
                      Gradient Studio
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <Tabs defaultValue="presets" className="w-full">
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="presets" className="text-xs">
                          <Sparkles className="w-3 h-3 mr-1" />
                          Presets
                        </TabsTrigger>
                        <TabsTrigger value="colors" className="text-xs">
                          <Palette className="w-3 h-3 mr-1" />
                          Colors
                        </TabsTrigger>
                        <TabsTrigger value="animation" className="text-xs">
                          <Settings className="w-3 h-3 mr-1" />
                          Motion
                        </TabsTrigger>
                        <TabsTrigger value="layout" className="text-xs">
                          <Code2 className="w-3 h-3 mr-1" />
                          Layout
                        </TabsTrigger>
                      </TabsList>

                      {/* Presets Tab */}
                      <TabsContent value="presets" className="space-y-4">
                        <div className="space-y-3">
                          <Label className="text-sm font-medium">Choose a Starting Point</Label>
                          <div className="grid grid-cols-1 gap-3">
                            {GRADIENT_PRESETS.map((preset, index) => (
                              <Section
                                key={preset.name}
                                delay={index * 0.1}
                                className="grid gap-0"
                              >
                                <button
                                  type="button"
                                  onClick={() => applyPreset(preset)}
                                  className="group cursor-pointer p-3 rounded-lg border-2 border-border hover:border-primary/50 transition-all bg-gradient-to-r hover:shadow-lg w-full text-left"
                                  style={{
                                    backgroundImage: `linear-gradient(135deg, ${preset.colors.join(', ')})`
                                  }}
                                >
                                  <div className="bg-card/90 backdrop-blur-sm rounded-md p-2">
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <h4 className="font-medium text-sm">{preset.name}</h4>
                                        <p className="text-xs text-muted-foreground">{preset.description}</p>
                                      </div>
                                      <div className="flex gap-1">
                                        {preset.colors.map((color, i) => (
                                          <div
                                            key={`${preset.name}-color-${i}`}
                                            className="w-3 h-3 rounded-full border border-white/20"
                                            style={{ backgroundColor: color }}
                                          />
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </button>
                              </Section>
                            ))}
                          </div>
                        </div>
                      </TabsContent>

                      {/* Colors Tab */}
                      <TabsContent value="colors" className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium">Custom Colors ({config.colors.length}/8)</Label>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={addColor}
                            disabled={config.colors.length >= 8}
                            className="group"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="space-y-3">
                          <AnimatePresence>
                            {config.colors.map((color, index) => (
                              <Section
                                key={`color-${index}-${color}`}
                                delay={index * 0.05}
                                className="group flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted/80 transition-colors"
                              >
                                <div className="relative">
                                  <input
                                    type="color"
                                    value={color}
                                    onChange={(e) => updateColor(index, e.target.value)}
                                    className="w-12 h-12 rounded-lg border-2 border-white/20 cursor-pointer shadow-lg"
                                    style={{ backgroundColor: color }}
                                  />
                                  <div className="absolute inset-0 rounded-lg ring-2 ring-transparent group-hover:ring-primary/50 transition-all" />
                                </div>
                                <Input
                                  value={color}
                                  onChange={(e) => updateColor(index, e.target.value)}
                                  className="flex-1 font-mono text-sm bg-background/50"
                                  placeholder="#000000"
                                />
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeColor(index)}
                                  disabled={config.colors.length <= 2}
                                  className="group hover:bg-destructive/10 hover:border-destructive/50"
                                >
                                  <Trash2 className="w-4 h-4 group-hover:text-destructive transition-colors" />
                                </Button>
                              </Section>
                            ))}
                          </AnimatePresence>
                        </div>
                      </TabsContent>

                      {/* Animation Tab */}
                      <TabsContent value="animation" className="space-y-6">
                        <div className="space-y-4">
                          <Label className="text-sm font-medium">Motion Controls</Label>

                          <div className="space-y-4">
                            <Section
                              delay={0.1}
                              className="space-y-3 p-4 rounded-lg bg-muted/30"
                            >
                              <div className="flex items-center justify-between">
                                <Label className="text-sm">Distortion</Label>
                                <span className="text-sm font-mono bg-primary/10 px-2 py-1 rounded text-primary">
                                  {config.distortion.toFixed(1)}
                                </span>
                              </div>
                              <Slider
                                value={[config.distortion]}
                                onValueChange={([value]) => updateConfig({ distortion: value })}
                                min={0}
                                max={2}
                                step={0.1}
                                className="w-full"
                              />
                              <p className="text-xs text-muted-foreground">Controls the mesh deformation intensity</p>
                            </Section>

                            <Section
                              delay={0.2}
                              className="space-y-3 p-4 rounded-lg bg-muted/30"
                            >
                              <div className="flex items-center justify-between">
                                <Label className="text-sm">Animation Speed</Label>
                                <span className="text-sm font-mono bg-primary/10 px-2 py-1 rounded text-primary">
                                  {config.speed.toFixed(2)}
                                </span>
                              </div>
                              <Slider
                                value={[config.speed]}
                                onValueChange={([value]) => updateConfig({ speed: value })}
                                min={0}
                                max={1}
                                step={0.05}
                                className="w-full"
                              />
                              <p className="text-xs text-muted-foreground">How fast the gradient animates</p>
                            </Section>

                            <Section
                              delay={0.3}
                              className="space-y-3 p-4 rounded-lg bg-muted/30"
                            >
                              <div className="flex items-center justify-between">
                                <Label className="text-sm">Swirl Effect</Label>
                                <span className="text-sm font-mono bg-primary/10 px-2 py-1 rounded text-primary">
                                  {config.swirl.toFixed(1)}
                                </span>
                              </div>
                              <Slider
                                value={[config.swirl]}
                                onValueChange={([value]) => updateConfig({ swirl: value })}
                                min={0}
                                max={2}
                                step={0.1}
                                className="w-full"
                              />
                              <p className="text-xs text-muted-foreground">Adds rotational movement to the mesh</p>
                            </Section>
                          </div>
                        </div>
                      </TabsContent>

                      {/* Layout Tab */}
                      <TabsContent value="layout" className="space-y-4">
                        <div className="space-y-4">
                          <Label className="text-sm font-medium">Layout Settings</Label>

                          <div className="grid grid-cols-2 gap-4">
                            <Section
                              delay={0.1}
                              className="space-y-2"
                            >
                              <Label className="text-sm">Width</Label>
                              <Input
                                value={config.width}
                                onChange={(e) => updateConfig({ width: e.target.value })}
                                placeholder="100vw"
                                className="font-mono text-sm"
                              />
                            </Section>
                            <Section
                              delay={0.2}
                              className="space-y-2"
                            >
                              <Label className="text-sm">Height</Label>
                              <Input
                                value={config.height}
                                onChange={(e) => updateConfig({ height: e.target.value })}
                                placeholder="100vh"
                                className="font-mono text-sm"
                              />
                            </Section>
                          </div>

                          <Section
                            delay={0.3}
                            className="space-y-2"
                          >
                            <Label className="text-sm">CSS Position</Label>
                            <select
                              value={config.position}
                              onChange={(e) => updateConfig({ position: e.target.value as "fixed" | "absolute" | "relative" })}
                              className="w-full p-3 border rounded-lg bg-background hover:border-primary/50 transition-colors focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            >
                              <option value="fixed">Fixed (stays in viewport)</option>
                              <option value="absolute">Absolute (relative to parent)</option>
                              <option value="relative">Relative (normal flow)</option>
                            </select>
                          </Section>

                          <Section
                            delay={0.4}
                            className="space-y-3 p-4 rounded-lg bg-muted/30"
                          >
                            <div className="flex items-center justify-between">
                              <Label className="text-sm">Z-Index</Label>
                              <span className="text-sm font-mono bg-primary/10 px-2 py-1 rounded text-primary">
                                {config.zIndex}
                              </span>
                            </div>
                            <Slider
                              value={[config.zIndex]}
                              onValueChange={([value]) => updateConfig({ zIndex: value })}
                              min={-10}
                              max={10}
                              step={1}
                              className="w-full"
                            />
                            <p className="text-xs text-muted-foreground">Controls layer stacking order</p>
                          </Section>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </Section>

              {/* Right Column - Preview & Code */}
              <div className="space-y-6">
                {/* Container Preview */}
                <AnimatePresence>
                  {previewMode === "container" && showPreview && (
                    <motion.div
                      initial={{ opacity: 0, x: 20, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: 20, scale: 0.95 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Card className="bg-card/95 backdrop-blur-sm border-2 hover:border-primary/20 transition-colors overflow-hidden">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Eye className="w-5 h-5 text-primary" />
                            Live Preview
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="relative w-full h-80 rounded-xl overflow-hidden border-2 border-border/50 shadow-2xl">
                            <MeshGradient
                              colors={config.colors}
                              distortion={config.distortion}
                              speed={config.speed}
                              swirl={config.swirl}
                              style={{
                                width: "100%",
                                height: "100%",
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                            <div className="absolute bottom-4 left-4 bg-white/10 backdrop-blur-md rounded-lg px-3 py-2">
                              <p className="text-white text-sm font-medium">Your Gradient ✨</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Code Generation */}
                <Section delay={0.7}>
                  <Card className="bg-card/95 backdrop-blur-sm border-2 hover:border-primary/20 transition-colors">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Code2 className="w-5 h-5 text-primary" />
                          Export Code
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={copyCode}
                            className="group"
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Copy
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={downloadCode}
                            className="group bg-gradient-to-r from-green-500/10 to-blue-500/10 hover:from-green-500/20 hover:to-blue-500/20"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="relative">
                        <pre className="bg-slate-900 text-slate-100 p-4 md:p-6 rounded-xl overflow-x-auto text-xs md:text-sm font-mono border border-slate-700 shadow-inner max-w-full">
                          <code className="language-tsx whitespace-pre-wrap break-words">{generateCode()}</code>
                        </pre>
                        <div className="absolute top-4 right-4 bg-slate-800/80 backdrop-blur-sm rounded-lg px-2 py-1">
                          <span className="text-xs text-slate-300">React + TypeScript</span>
                        </div>
                      </div>

                      <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="flex items-start gap-2">
                          <Heart className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div className="text-sm">
                            <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                              Ready to use!
                            </p>
                            <p className="text-blue-700 dark:text-blue-300">
                              Copy this code into your React component. Don't forget to install{" "}
                              <code className="bg-blue-100 dark:bg-blue-900 px-1 py-0.5 rounded text-xs">
                                @paper-design/shaders-react
                              </code>
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Section>
              </div>
            </Section>
          </div>
        </div>
      </div>
    </div>
  )
}
