"use client"

import { useState, useCallback } from "react"
import { MeshGradient } from "@paper-design/shaders-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Plus, Trash2, Download, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"

const DEFAULT_COLORS = ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4"]

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
      {showPreview && (
        <div className={previewMode === "fullscreen" ? "fixed inset-0" : "hidden"}>
          <MeshGradient
            colors={config.colors}
            distortion={config.distortion}
            speed={config.speed}
            swirl={config.swirl}
            style={{
              position: config.position,
              inset: previewMode === "fullscreen" ? 0 : undefined,
              width: config.width,
              height: config.height,
              zIndex: config.zIndex,
            }}
          />
        </div>
      )}

      <div className="relative z-10 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="bg-card/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Gradient Controls
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setShowPreview(!showPreview)}>
                      {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPreviewMode((prev) => (prev === "fullscreen" ? "container" : "fullscreen"))}
                    >
                      {previewMode === "fullscreen" ? "Container" : "Fullscreen"}
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Tabs defaultValue="colors" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="colors">Colors</TabsTrigger>
                    <TabsTrigger value="animation">Animation</TabsTrigger>
                    <TabsTrigger value="layout">Layout</TabsTrigger>
                  </TabsList>

                  <TabsContent value="colors" className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Gradient Colors ({config.colors.length}/8)</Label>
                      <Button variant="outline" size="sm" onClick={addColor} disabled={config.colors.length >= 8}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {config.colors.map((color, index) => (
                        <div key={color} className="flex items-center gap-2">
                          <input
                            type="color"
                            value={color}
                            onChange={(e) => updateColor(index, e.target.value)}
                            className="w-12 h-10 rounded border cursor-pointer"
                          />
                          <Input
                            value={color}
                            onChange={(e) => updateColor(index, e.target.value)}
                            className="flex-1 font-mono text-sm"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeColor(index)}
                            disabled={config.colors.length <= 2}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="animation" className="space-y-6">
                    <div className="space-y-3">
                      <Label>Distortion: {config.distortion}</Label>
                      <Slider
                        value={[config.distortion]}
                        onValueChange={([value]) => updateConfig({ distortion: value })}
                        min={0}
                        max={2}
                        step={0.1}
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label>Speed: {config.speed}</Label>
                      <Slider
                        value={[config.speed]}
                        onValueChange={([value]) => updateConfig({ speed: value })}
                        min={0}
                        max={1}
                        step={0.05}
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label>Swirl: {config.swirl}</Label>
                      <Slider
                        value={[config.swirl]}
                        onValueChange={([value]) => updateConfig({ swirl: value })}
                        min={0}
                        max={2}
                        step={0.1}
                        className="w-full"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="layout" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Width</Label>
                        <Input
                          value={config.width}
                          onChange={(e) => updateConfig({ width: e.target.value })}
                          placeholder="100vw"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Height</Label>
                        <Input
                          value={config.height}
                          onChange={(e) => updateConfig({ height: e.target.value })}
                          placeholder="100vh"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Position</Label>
                      <select
                        value={config.position}
                        onChange={(e) => updateConfig({ position: e.target.value as any })}
                        className="w-full p-2 border rounded-md bg-background"
                      >
                        <option value="fixed">Fixed</option>
                        <option value="absolute">Absolute</option>
                        <option value="relative">Relative</option>
                      </select>
                    </div>
                    <div className="space-y-3">
                      <Label>Z-Index: {config.zIndex}</Label>
                      <Slider
                        value={[config.zIndex]}
                        onValueChange={([value]) => updateConfig({ zIndex: value })}
                        min={-10}
                        max={10}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <div className="space-y-6">
              {previewMode === "container" && showPreview && (
                <Card className="bg-card/95 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative w-full h-64 rounded-lg overflow-hidden border">
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
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card className="bg-card/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Generated Code
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={copyCode}>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                      <Button variant="outline" size="sm" onClick={downloadCode}>
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm font-mono">
                    <code>{generateCode()}</code>
                  </pre>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
