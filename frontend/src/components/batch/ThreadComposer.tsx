import { useState } from 'react';
import { usePostThread } from '@/hooks/useBatchContract';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Send, X } from 'lucide-react';
import { useToast } from '@/components/ui/toast';
import { getContractErrorMessage } from '@/lib/contractErrors';

export function ThreadComposer() {
    const [posts, setPosts] = useState(['']);
    const postThread = usePostThread();
    const { showToast } = useToast();

    const addPost = () => {
        if (posts.length < 10) {
            setPosts([...posts, '']);
        }
    };

    const removePost = (index: number) => {
        if (posts.length > 1) {
            setPosts(posts.filter((_, i) => i !== index));
        }
    };

    const updatePost = (index: number, value: string) => {
        const updated = [...posts];
        updated[index] = value;
        setPosts(updated);
    };

    const handleSubmit = async () => {
        const validPosts = posts.filter(p => p.trim());
        if (validPosts.length === 0) return;

        try {
            await postThread.mutateAsync(validPosts);
            showToast('Thread posted successfully!', 'success');
            setPosts(['']);
        } catch (error) {
            showToast(getContractErrorMessage(error), 'error');
            console.error(error);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Create Thread</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {posts.map((post, index) => (
                    <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">
                                Post {index + 1}/{posts.length}
                            </label>
                            {posts.length > 1 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removePost(index)}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                        <Textarea
                            value={post}
                            onChange={(e) => updatePost(index, e.target.value)}
                            placeholder={`Thread ${index + 1}/${posts.length}`}
                            rows={3}
                            maxLength={500}
                        />
                        <p className="text-xs text-muted-foreground">{post.length}/500</p>
                    </div>
                ))}

                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={addPost}
                        disabled={posts.length >= 10}
                        className="flex-1"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Post
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={postThread.isPending || posts.every(p => !p.trim())}
                        className="flex-1"
                    >
                        <Send className="w-4 h-4 mr-2" />
                        {postThread.isPending ? 'Posting...' : 'Post Thread'}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
