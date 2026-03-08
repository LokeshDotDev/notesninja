"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import {
  FileText,
  ArrowLeft,
  Loader2,
  Upload,
  Search,
  Eye,
  Edit,
  Trash2
} from "lucide-react";
import Notification from "@/components/custom/Notification";

interface SampleFile {
  id: string;
  fileName: string;
  fileUrl: string;
  publicId: string;
  fileSize: number;
  fileType: string;
  postId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  post: {
    title: string;
  };
  _count: {
    downloads: number;
  };
}

interface Post {
  id: string;
  title: string;
}

export default function SampleFilesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sampleFiles, setSampleFiles] = useState<SampleFile[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({ show: false, message: "", type: "success" });

  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<SampleFile | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    fileName: "",
    fileUrl: "",
    publicId: "",
    fileSize: 0,
    fileType: "",
    postId: "",
    isActive: true,
  });
  const [formLoading, setFormLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Check if user is admin
  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user?.role !== "ADMIN") {
      router.push("/");
    }
  }, [session, status, router]);

  // Fetch sample files
  const fetchSampleFiles = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/sample-files");
      const data = await response.json();
      
      if (data.success) {
        setSampleFiles(data.sampleFiles);
      } else {
        showNotification("Failed to fetch sample files", "error");
      }
    } catch (error) {
      console.error("Error fetching sample files:", error);
      showNotification("Error fetching sample files", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch posts for dropdown
  const fetchPosts = useCallback(async () => {
    try {
      const response = await fetch("/api/posts");
      const data = await response.json();
      
      console.log("Posts API response:", data); // Debug log
      
      // The API returns an array directly, not an object with success/posts
      if (Array.isArray(data)) {
        console.log("Posts loaded:", data.length); // Debug log
        setPosts(data);
      } else if (data.success && Array.isArray(data.posts)) {
        console.log("Posts loaded:", data.posts.length); // Debug log
        setPosts(data.posts);
      } else {
        console.error("Unexpected API response format:", data);
        setPosts([]);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setPosts([]);
    }
  }, []);

  useEffect(() => {
    if (session && session.user?.role === "ADMIN") {
      fetchSampleFiles();
      fetchPosts();
    }
  }, [session, fetchSampleFiles, fetchPosts]);

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  const handleCreateSampleFile = async () => {
    try {
      setFormLoading(true);
      
      // If file is uploaded, handle it differently
      if (uploadedFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', uploadedFile);
        uploadFormData.append('fileName', formData.fileName || uploadedFile.name);
        uploadFormData.append('postId', formData.postId);
        uploadFormData.append('isActive', formData.isActive.toString());

        const response = await fetch("/api/sample-files/upload", {
          method: "POST",
          body: uploadFormData,
        });

        const data = await response.json();
        
        if (data.success) {
          showNotification("Sample file uploaded successfully", "success");
          setIsCreateDialogOpen(false);
          resetForm();
          fetchSampleFiles();
        } else {
          showNotification(data.error || "Failed to upload sample file", "error");
        }
      } else {
        // Original logic for manual URL entry
        const response = await fetch("/api/sample-files", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();
        
        if (data.success) {
          showNotification("Sample file created successfully", "success");
          setIsCreateDialogOpen(false);
          resetForm();
          fetchSampleFiles();
        } else {
          showNotification(data.error || "Failed to create sample file", "error");
        }
      }
    } catch (error) {
      console.error("Error creating sample file:", error);
      showNotification("Error creating sample file", "error");
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateSampleFile = async () => {
    if (!selectedFile) return;

    try {
      setFormLoading(true);
      const response = await fetch(`/api/sample-files/${selectedFile.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (data.success) {
        showNotification("Sample file updated successfully", "success");
        setIsEditDialogOpen(false);
        resetForm();
        fetchSampleFiles();
      } else {
        showNotification(data.error || "Failed to update sample file", "error");
      }
    } catch (error) {
      console.error("Error updating sample file:", error);
      showNotification("Error updating sample file", "error");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteSampleFile = async (id: string) => {
    if (!confirm("Are you sure you want to delete this sample file?")) return;

    try {
      const response = await fetch(`/api/sample-files/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();
      
      if (data.success) {
        showNotification("Sample file deleted successfully", "success");
        fetchSampleFiles();
      } else {
        showNotification(data.error || "Failed to delete sample file", "error");
      }
    } catch (error) {
      console.error("Error deleting sample file:", error);
      showNotification("Error deleting sample file", "error");
    }
  };

  const resetForm = () => {
    setFormData({
      fileName: "",
      fileUrl: "",
      publicId: "",
      fileSize: 0,
      fileType: "",
      postId: "",
      isActive: true,
    });
    setSelectedFile(null);
    setUploadedFile(null);
  };

  const openEditDialog = (file: SampleFile) => {
    setSelectedFile(file);
    setFormData({
      fileName: file.fileName,
      fileUrl: file.fileUrl,
      publicId: file.publicId,
      fileSize: file.fileSize,
      fileType: file.fileType,
      postId: file.postId,
      isActive: file.isActive,
    });
    setIsEditDialogOpen(true);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const filteredFiles = sampleFiles.filter(file =>
    file.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (status === "loading" || !session || session.user?.role !== "ADMIN") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.push('/admin')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Admin
          </Button>
          <h1 className="text-3xl font-bold">Sample Files Management</h1>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setIsCreateDialogOpen(true);
          }}
          className="flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          Add Sample File
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search by file name or product title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Files List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredFiles.map((file) => (
            <Card key={file.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <h3 className="font-semibold text-lg">{file.fileName}</h3>
                      <Badge variant={file.isActive ? "default" : "secondary"}>
                        {file.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-2">Product: {file.post.title}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Size: {formatFileSize(file.fileSize)}</span>
                      <span>Type: {file.fileType}</span>
                      <span>Downloads: {file._count.downloads}</span>
                      <span>Created: {new Date(file.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(file.fileUrl, '_blank')}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(file)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteSampleFile(file.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isCreateDialogOpen || isEditDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setIsCreateDialogOpen(false);
          setIsEditDialogOpen(false);
          resetForm();
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isCreateDialogOpen ? "Add Sample File" : "Edit Sample File"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="fileName">Sample Name</Label>
              <Input
                id="fileName"
                value={formData.fileName}
                onChange={(e) => setFormData(prev => ({ ...prev, fileName: e.target.value }))}
                placeholder="Enter sample name"
              />
            </div>
            
            <div>
              <Label htmlFor="file">Upload PDF File</Label>
              <Input
                id="file"
                type="file"
                accept=".pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setUploadedFile(file);
                    // Auto-fill file name if not provided
                    if (!formData.fileName) {
                      setFormData(prev => ({ ...prev, fileName: file.name.replace('.pdf', '') }));
                    }
                  }
                }}
                className="file:mr-0 file:text-sm file:font-medium"
              />
              {uploadedFile && (
                <p className="text-sm text-green-600 mt-1">
                  Selected: {uploadedFile.name} ({(uploadedFile.size / 1024).toFixed(1)} KB)
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="postId">Product</Label>
              <Select 
  value={formData.postId} 
  onValueChange={(value) => setFormData(prev => ({ ...prev, postId: value }))}
>
  <SelectTrigger>
    <SelectValue placeholder="Select a product" />
  </SelectTrigger>
  <SelectContent className="z-[9999] max-h-60 overflow-y-auto">
    {posts.map((post) => (
      <SelectItem key={post.id} value={post.id}>
        {post.title}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked: boolean) => setFormData(prev => ({ ...prev, isActive: checked }))}
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreateDialogOpen(false);
                  setIsEditDialogOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={isCreateDialogOpen ? handleCreateSampleFile : handleUpdateSampleFile}
                disabled={formLoading}
              >
                {formLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : isCreateDialogOpen ? (
                  "Create"
                ) : (
                  "Update"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Notification */}
      {notification.show && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(prev => ({ ...prev, show: false }))}
        />
      )}
    </div>
  );
}
