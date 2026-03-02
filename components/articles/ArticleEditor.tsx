"use client"

import { useState, useEffect, useRef } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import { Extension } from '@tiptap/core'
import { Node, mergeAttributes } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'
import Color from '@tiptap/extension-color'
import { TextStyle } from '@tiptap/extension-text-style'
import Highlight from '@tiptap/extension-highlight'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import { Table } from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { createLowlight } from 'lowlight'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { 
  Bold, Italic, Underline as UnderlineIcon, List, ListOrdered, Quote, Code,
  Heading1, Heading2, Heading3, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Highlighter, Palette,
  Undo, Redo, Film, Upload, ExternalLink, LinkIcon
} from 'lucide-react'

const lowlight = createLowlight()

// Custom Iframe Extension for YouTube embeds
const Iframe = Node.create({
  name: 'iframe',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      frameborder: {
        default: 0,
      },
      allowfullscreen: {
        default: true,
      },
      style: {
        default: 'width: 100%; height: 400px; border-radius: 0.5rem; margin: 1rem 0;',
      },
    }
  },

  parseHTML() {
    return [{
      tag: 'iframe',
    }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['iframe', mergeAttributes(HTMLAttributes)]
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addCommands(): any {
    return {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setIframe: (options: { src: string }) => ({ commands }: { commands: any }) => {
        return commands.insertContent({
          type: this.name,
          attrs: options,
        })
      },
    }
  },
})

// Custom Font Size Extension
const FontSizeExtension = Extension.create({
  name: 'fontSize',
  addOptions() {
    return { types: ['textStyle'] }
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element: HTMLElement) => element.style.fontSize.replace(/['"]+/g, ''),
            renderHTML: (attributes: Record<string, string | number | null>) => {
              if (!attributes.fontSize) return {}
              return { style: `font-size: ${attributes.fontSize}` }
            },
          },
        },
      },
    ]
  },
})

// MenuBar component with all formatting and media options
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MenuBar = ({ editor, onImageUpload, onLinkClick, uploadingMedia }: { editor: any; onImageUpload: (file: File) => void; onLinkClick: () => void; uploadingMedia: boolean }) => {
  const imageInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

  if (!editor) return null

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onImageUpload(file)
    }
  }

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      editor.chain().focus().insertContent(`<video controls style="max-width: 100%; border-radius: 0.5rem; margin: 1rem 0;"><source src="${url}" type="video/mp4"></video>`).run()
    }
  }

  const handleYoutubeEmbed = () => {
    const url = window.prompt('Enter YouTube URL (e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ):')
    if (url) {
      let videoId = ''
      if (url.includes('youtu.be')) {
        videoId = url.split('youtu.be/')[1]?.split('?')[0]
      } else if (url.includes('youtube.com')) {
        videoId = url.split('v=')[1]?.split('&')[0]
      }
      if (videoId) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (editor as any).chain().focus().setIframe({ src: `https://www.youtube.com/embed/${videoId}` }).run()
      } else {
        alert('Invalid YouTube URL')
      }
    }
  }

  return (
    <div className="border border-gray-200 rounded-t-lg p-2 flex flex-wrap gap-2 bg-gray-50">
      {/* Text Formatting */}
      <div className="flex gap-1 border-r pr-2">
        <Button type="button" variant="ghost" size="sm" title="Bold" onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBold().run() }} className={editor.isActive('bold') ? 'bg-gray-200' : ''}><Bold className="h-4 w-4" /></Button>
        <Button type="button" variant="ghost" size="sm" title="Italic" onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleItalic().run() }} className={editor.isActive('italic') ? 'bg-gray-200' : ''}><Italic className="h-4 w-4" /></Button>
        <Button type="button" variant="ghost" size="sm" title="Underline" onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleUnderline().run() }} className={editor.isActive('underline') ? 'bg-gray-200' : ''}><UnderlineIcon className="h-4 w-4" /></Button>
      </div>

      {/* Headings */}
      <div className="flex gap-1 border-r pr-2">
        <Button type="button" variant="ghost" size="sm" title="Heading 1" onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 1 }).run() }} className={editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''}><Heading1 className="h-4 w-4" /></Button>
        <Button type="button" variant="ghost" size="sm" title="Heading 2" onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 2 }).run() }} className={editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''}><Heading2 className="h-4 w-4" /></Button>
        <Button type="button" variant="ghost" size="sm" title="Heading 3" onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 3 }).run() }} className={editor.isActive('heading', { level: 3 }) ? 'bg-gray-200' : ''}><Heading3 className="h-4 w-4" /></Button>
      </div>

      {/* Lists & Quotes */}
      <div className="flex gap-1 border-r pr-2">
        <Button type="button" variant="ghost" size="sm" title="Bullet List" onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBulletList().run() }} className={editor.isActive('bulletList') ? 'bg-gray-200' : ''}><List className="h-4 w-4" /></Button>
        <Button type="button" variant="ghost" size="sm" title="Numbered List" onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleOrderedList().run() }} className={editor.isActive('orderedList') ? 'bg-gray-200' : ''}><ListOrdered className="h-4 w-4" /></Button>
        <Button type="button" variant="ghost" size="sm" title="Quote" onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBlockquote().run() }} className={editor.isActive('blockquote') ? 'bg-gray-200' : ''}><Quote className="h-4 w-4" /></Button>
        <Button type="button" variant="ghost" size="sm" title="Code Block" onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleCodeBlock().run() }} className={editor.isActive('codeBlock') ? 'bg-gray-200' : ''}><Code className="h-4 w-4" /></Button>
      </div>

      {/* Alignment */}
      <div className="flex gap-1 border-r pr-2">
        <Button type="button" variant="ghost" size="sm" title="Align Left" onClick={(e) => { e.preventDefault(); editor.chain().focus().setTextAlign('left').run() }}><AlignLeft className="h-4 w-4" /></Button>
        <Button type="button" variant="ghost" size="sm" title="Align Center" onClick={(e) => { e.preventDefault(); editor.chain().focus().setTextAlign('center').run() }}><AlignCenter className="h-4 w-4" /></Button>
        <Button type="button" variant="ghost" size="sm" title="Align Right" onClick={(e) => { e.preventDefault(); editor.chain().focus().setTextAlign('right').run() }}><AlignRight className="h-4 w-4" /></Button>
        <Button type="button" variant="ghost" size="sm" title="Align Justify" onClick={(e) => { e.preventDefault(); editor.chain().focus().setTextAlign('justify').run() }}><AlignJustify className="h-4 w-4" /></Button>
      </div>

      {/* Media & Links */}
      <div className="flex gap-1 border-r pr-2">
        <Button type="button" variant="ghost" size="sm" title="Upload Image" onClick={(e) => { e.preventDefault(); imageInputRef.current?.click() }} disabled={uploadingMedia}><Upload className="h-4 w-4" /></Button>
        <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
        
        <Button type="button" variant="ghost" size="sm" title="Upload Video" onClick={(e) => { e.preventDefault(); videoInputRef.current?.click() }} disabled={uploadingMedia}><Film className="h-4 w-4" /></Button>
        <input ref={videoInputRef} type="file" accept="video/*" onChange={handleVideoSelect} className="hidden" />
        
        <Button type="button" variant="ghost" size="sm" title="YouTube Embed" onClick={(e) => { e.preventDefault(); handleYoutubeEmbed() }}><ExternalLink className="h-4 w-4" /></Button>
        <Button type="button" variant="ghost" size="sm" title="Add Link (SEO)" onClick={(e) => { e.preventDefault(); onLinkClick() }}><LinkIcon className="h-4 w-4" /></Button>
        <Button type="button" variant="ghost" size="sm" title="Highlight" onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleHighlight().run() }} className={editor.isActive('highlight') ? 'bg-gray-200' : ''}><Highlighter className="h-4 w-4" /></Button>
        {uploadingMedia && <span className="text-xs text-blue-600 ml-2 flex items-center">Uploading...</span>}
      </div>

      {/* Undo/Redo */}
      <div className="flex gap-1 border-r pr-2">
        <Button type="button" variant="ghost" size="sm" title="Undo" onClick={(e) => { e.preventDefault(); editor.chain().focus().undo().run() }} disabled={!editor.can().undo()}><Undo className="h-4 w-4" /></Button>
        <Button type="button" variant="ghost" size="sm" title="Redo" onClick={(e) => { e.preventDefault(); editor.chain().focus().redo().run() }} disabled={!editor.can().redo()}><Redo className="h-4 w-4" /></Button>
      </div>

      {/* Color & Font Size */}
      <div className="flex gap-1">
        <input type="color" onChange={(e) => editor.chain().focus().setColor(e.target.value).run()} value={editor.getAttributes('textStyle').color || '#000000'} className="w-8 h-8 border rounded cursor-pointer" title="Text Color" />
        <Button type="button" variant="ghost" size="sm" title="Clear Color" onClick={(e) => { e.preventDefault(); editor.chain().focus().unsetColor().run() }}><Palette className="h-4 w-4" /></Button>
        <select value={editor.getAttributes('textStyle').fontSize || '16px'} onChange={(e) => editor.chain().focus().setMark('textStyle', { fontSize: e.target.value }).run()} className="px-2 py-1 text-xs border rounded bg-white" title="Font Size">
          <option value="12px">12px</option>
          <option value="14px">14px</option>
          <option value="16px">16px</option>
          <option value="18px">18px</option>
          <option value="20px">20px</option>
          <option value="24px">24px</option>
          <option value="30px">30px</option>
          <option value="36px">36px</option>
        </select>
      </div>
    </div>
  )
}

interface ArticleEditorProps {
  initialData?: {
    title?: string
    excerpt?: string
    content?: string
    coverImage?: string
    coverImagePublicId?: string
    published?: boolean
    featured?: boolean
    tags?: string[]
    metaTitle?: string
    metaDescription?: string
  }
  onSave: (data: Record<string, unknown>) => void
  onCancel: () => void
}

export default function ArticleEditor({ initialData, onSave, onCancel }: ArticleEditorProps) {
  const [title, setTitle] = useState(initialData?.title || '')
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || '')
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || '')
  const [coverImagePublicId, setCoverImagePublicId] = useState(initialData?.coverImagePublicId || '')
  const [coverImageLoading, setCoverImageLoading] = useState(false)
  const [published, setPublished] = useState(initialData?.published || false)
  const [featured, setFeatured] = useState(initialData?.featured || false)
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>(initialData?.tags || [])
  const [metaTitle, setMetaTitle] = useState(initialData?.metaTitle || '')
  const [metaDescription, setMetaDescription] = useState(initialData?.metaDescription || '')
  const [isMounted, setIsMounted] = useState(false)
  const [linkDialog, setLinkDialog] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [linkText, setLinkText] = useState('')
  const [linkRel, setLinkRel] = useState('dofollow')
  const [uploadingMedia, setUploadingMedia] = useState(false)

  useEffect(() => { setIsMounted(true) }, [])

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Image.configure({ HTMLAttributes: { class: 'max-w-full h-auto rounded-lg my-4' } }),
      Iframe,
      Link.configure({ 
        openOnClick: false, 
        HTMLAttributes: { 
          class: 'text-blue-600 hover:text-blue-800 underline',
        },
        autolink: true,
      }),
      Placeholder.configure({ placeholder: 'Start writing your article...' }),
      CharacterCount.configure({ limit: 50000 }),
      Color,
      TextStyle,
      FontSizeExtension,
      Highlight.configure({ multicolor: true }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell.configure({ HTMLAttributes: { class: 'border border-gray-300 px-2 py-1' } }),
      CodeBlockLowlight.configure({ lowlight }),
    ],
    content: initialData?.content || '',
    editorProps: {
      attributes: { class: 'prose prose-lg max-w-none min-h-[400px] p-4 focus:outline-none' },
    },
    immediatelyRender: false,
  })

  const handleImageUpload = async (file: File) => {
    try {
      setUploadingMedia(true)
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/articles/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Upload failed')
      }

      const data = await response.json()
      
      if (data.type === 'image') {
        editor?.chain().focus().setImage({ src: data.url }).run()
      } else if (data.type === 'video') {
        editor?.chain().focus().insertContent(
          `<video controls style="max-width: 100%; border-radius: 0.5rem; margin: 1rem 0;"><source src="${data.url}" type="video/mp4"></video>`
        ).run()
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setUploadingMedia(false)
    }
  }

  const handleCoverImageUpload = async (file: File) => {
    try {
      setCoverImageLoading(true)
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/articles/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Upload failed')
      }

      const data = await response.json()
      setCoverImage(data.url)
      setCoverImagePublicId(data.public_id || '')
    } catch (error) {
      console.error('Cover image upload error:', error)
      alert(error instanceof Error ? error.message : 'Cover image upload failed')
    } finally {
      setCoverImageLoading(false)
    }
  }

  const handleAddLink = () => {
    if (linkUrl) {
      editor?.chain().focus().insertContent(
        `<a href="${linkUrl}" target="_blank" rel="${linkRel === 'nofollow' ? 'nofollow' : 'follow'}" class="text-blue-600 hover:text-blue-800 underline">${linkText || 'Link'}</a>`
      ).run()
      setLinkDialog(false)
      setLinkUrl('')
      setLinkText('')
      setLinkRel('dofollow')
    }
  }

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleSave = (forcePublished?: boolean) => {
    if (!title.trim() || !editor?.getHTML()) {
      alert('Please fill in the title and content')
      return
    }

    const htmlContent = editor.getHTML()
    onSave({
      title: title.trim(),
      excerpt: excerpt.trim(),
      content: htmlContent,
      coverImage: coverImage.trim() || undefined,
      coverImagePublicId: coverImagePublicId.trim() || undefined,
      published: forcePublished !== undefined ? forcePublished : published,
      featured,
      tags,
      metaTitle: metaTitle.trim() || undefined,
      metaDescription: metaDescription.trim() || undefined,
    })
  }

  if (!isMounted) return <div className="p-6">Loading editor...</div>

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{initialData ? 'Edit Article' : 'New Article'}</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button onClick={() => handleSave()}>Save Draft</Button>
          <Button onClick={() => handleSave(true)} className="bg-green-600 hover:bg-green-700">Publish</Button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
        {/* Title */}
        <div>
          <Label htmlFor="title" className="text-sm font-semibold">Article Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter article title..."
            className="text-xl font-semibold mt-2"
          />
        </div>

        {/* Excerpt */}
        <div>
          <Label htmlFor="excerpt" className="text-sm font-semibold">Excerpt</Label>
          <Textarea
            id="excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Brief summary of the article..."
            rows={3}
            className="mt-2"
          />
        </div>

        {/* Cover Image */}
        <div>
          <Label className="text-sm font-semibold mb-2 block">Cover Image</Label>
          <div className="flex gap-2 mb-3">
            <Button 
              type="button" 
              onClick={() => {
                const input = document.createElement('input')
                input.type = 'file'
                input.accept = 'image/*'
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0]
                  if (file) handleCoverImageUpload(file)
                }
                input.click()
              }}
              disabled={coverImageLoading}
              className="gap-2"
            >
              {coverImageLoading ? 'Uploading...' : 'Upload from Computer'}
            </Button>
            {coverImage && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setCoverImage('')}
              >
                Remove
              </Button>
            )}
          </div>
          {coverImage && (
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={coverImage} alt="Cover" className="max-h-48 rounded-lg w-full object-cover" />
              <p className="text-xs text-gray-500 mt-2">✓ Image stored in Cloudinary</p>
            </div>
          )}
        </div>

        {/* Tags */}
        <div>
          <Label className="text-sm font-semibold mb-2 block">Tags</Label>
          <div className="flex gap-2 mb-3">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Add a tag..."
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            />
            <Button onClick={addTag} variant="outline">Add</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="cursor-pointer">
                {tag} <button onClick={() => removeTag(tag)} className="ml-2">×</button>
              </Badge>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="flex gap-6 py-2 border-y">
          <div className="flex items-center space-x-2">
            <Switch id="published" checked={published} onCheckedChange={setPublished} />
            <Label htmlFor="published" className="font-normal cursor-pointer">Published</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="featured" checked={featured} onCheckedChange={setFeatured} />
            <Label htmlFor="featured" className="font-normal cursor-pointer">Featured</Label>
          </div>
        </div>

        {/* Editor */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Content</Label>
          <p className="text-xs text-gray-500 mb-2">💡 Tip: Upload images/videos locally, add YouTube embeds, and use do-follow/no-follow links for SEO</p>
          <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
            <MenuBar 
              editor={editor} 
              onImageUpload={handleImageUpload}
              onLinkClick={() => setLinkDialog(true)}
              uploadingMedia={uploadingMedia}
            />
            <EditorContent editor={editor} className="bg-white" />
          </div>
          <p className="text-xs text-gray-500">
            {editor?.storage.characterCount.characters() || 0} / 50,000 characters
          </p>
        </div>

        {/* SEO Settings */}
        <div className="border-t pt-4">
          <h3 className="text-sm font-semibold mb-4">SEO Settings</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="metaTitle" className="text-sm">Meta Title</Label>
              <Input
                id="metaTitle"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder="SEO title (optional)"
                maxLength={60}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">{metaTitle.length}/60 characters</p>
            </div>
            <div>
              <Label htmlFor="metaDescription" className="text-sm">Meta Description</Label>
              <Textarea
                id="metaDescription"
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder="SEO description (optional)"
                maxLength={160}
                rows={2}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">{metaDescription.length}/160 characters</p>
            </div>
          </div>
        </div>
      </div>

      {/* Link Dialog */}
      <Dialog open={linkDialog} onOpenChange={setLinkDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Link with SEO Options</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="link-text" className="text-sm">Link Text</Label>
              <Input
                id="link-text"
                placeholder="Text to display"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="link-url" className="text-sm">URL</Label>
              <Input
                id="link-url"
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
              />
            </div>
            <div>
              <Label className="text-sm font-semibold block mb-3">Link Type (SEO Impact)</Label>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer p-2 rounded border" style={{borderColor: linkRel === 'dofollow' ? '#3b82f6' : '#e5e7eb'}}>
                  <input
                    type="radio"
                    name="linkRel"
                    value="dofollow"
                    checked={linkRel === 'dofollow'}
                    onChange={(e) => setLinkRel(e.target.value)}
                  />
                  <div>
                    <div className="font-medium text-sm">Do-Follow</div>
                    <div className="text-xs text-gray-500">Passes SEO value to linked site (default)</div>
                  </div>
                </label>
                <label className="flex items-center gap-3 cursor-pointer p-2 rounded border" style={{borderColor: linkRel === 'nofollow' ? '#3b82f6' : '#e5e7eb'}}>
                  <input
                    type="radio"
                    name="linkRel"
                    value="nofollow"
                    checked={linkRel === 'nofollow'}
                    onChange={(e) => setLinkRel(e.target.value)}
                  />
                  <div>
                    <div className="font-medium text-sm">No-Follow</div>
                    <div className="text-xs text-gray-500">Doesn&apos;t pass SEO value, use for ads/external links</div>
                  </div>
                </label>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setLinkDialog(false)}>Cancel</Button>
            <Button onClick={handleAddLink} className="bg-blue-600">Add Link</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}