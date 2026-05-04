import { useState } from 'react'
import { BookOpen, Video, FileText, Headphones, Download, ExternalLink } from 'lucide-react'
import { Badge } from '../../components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs'

const resources = [
  { id: 1, title: 'Algebraic Expressions Guide', type: 'pdf', subject: 'Mathematics', size: '2.3 MB', downloads: 245, icon: FileText },
  { id: 2, title: 'Cell Structure Animation', type: 'video', subject: 'Science', size: '15 min', downloads: 189, icon: Video },
  { id: 3, title: 'English Grammar Podcast', type: 'audio', subject: 'English', size: '22 min', downloads: 156, icon: Headphones },
  { id: 4, title: 'Ancient Egypt Documentary', type: 'video', subject: 'History', size: '45 min', downloads: 321, icon: Video },
  { id: 5, title: 'Geometry Formulas Cheat Sheet', type: 'pdf', subject: 'Mathematics', size: '1.1 MB', downloads: 412, icon: FileText },
  { id: 6, title: 'Photosynthesis Explained', type: 'video', subject: 'Science', size: '12 min', downloads: 278, icon: Video },
]

const savedItems = [
  { id: 1, title: 'Solving Linear Equations', type: 'lesson', course: 'Mathematics Grade 7', savedDate: '2 days ago' },
  { id: 2, title: 'World War II Timeline', type: 'resource', course: 'World History', savedDate: '1 week ago' },
  { id: 3, title: 'The Water Cycle', type: 'lesson', course: 'Life Sciences', savedDate: '3 days ago' },
]

const typeColors: Record<string, string> = {
  pdf: 'bg-destructive/10 text-destructive',
  video: 'bg-primary/10 text-primary',
  audio: 'bg-accent/10 text-accent',
}

export default function Library() {
  const [activeTab, setActiveTab] = useState('resources')

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <h2 className="mb-4 text-xl font-semibold">Library</h2>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 bg-muted rounded-xl p-1">
              <TabsTrigger value="resources" className="rounded-lg">
                Resources
              </TabsTrigger>
              <TabsTrigger value="saved" className="rounded-lg">
                Saved
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <Tabs value={activeTab}>
          <TabsContent value="resources" className="space-y-4 mt-0">
            <p className="text-muted-foreground">{resources.length} resources available</p>

            <div className="grid grid-cols-1 gap-3">
              {resources.map((resource) => {
                const Icon = resource.icon
                return (
                  <div
                    key={resource.id}
                    className="bg-card border border-border rounded-xl p-4 flex items-start gap-4"
                  >
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        typeColors[resource.type] ?? 'bg-muted text-muted-foreground'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="mb-1 line-clamp-1 font-medium">{resource.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{resource.subject}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{resource.size}</span>
                        <span>•</span>
                        <span>{resource.downloads} downloads</span>
                      </div>
                    </div>
                    <button className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center transition-transform active:scale-95">
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="saved" className="space-y-4 mt-0">
            <p className="text-muted-foreground">{savedItems.length} saved items</p>

            <div className="space-y-3">
              {savedItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-card border border-border rounded-xl p-4 flex items-start gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="mb-1 line-clamp-1 font-medium">{item.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{item.course}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs bg-muted border-0">
                        {item.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">Saved {item.savedDate}</span>
                    </div>
                  </div>
                  <button className="flex-shrink-0 w-10 h-10 rounded-full border-2 border-border flex items-center justify-center hover:bg-muted transition-colors">
                    <ExternalLink className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>
              ))}
            </div>

            {savedItems.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center text-3xl">
                  📚
                </div>
                <h3 className="mb-2 font-medium">No saved items</h3>
                <p className="text-muted-foreground">Items you bookmark will appear here</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
          <p className="font-medium">Coming soon</p>
          <p className="text-xs mt-1">
            Downloads and bookmarks are part of the offline-learning feature in development. Items shown for preview.
          </p>
        </div>
      </div>
    </div>
  )
}
