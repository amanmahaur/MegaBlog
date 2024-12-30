import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "..";
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PostForm({ post }) {
    const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
        defaultValues: {
            title: post?.title || "",
            slug: post?.$id || "",
            content: post?.content || "",
            status: post?.status || "active",
        },
    });

    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);

    const submit = async (data) => {
        try {
            console.log("Submitting Data:", data);

            if (!data.title) {
                console.error("Error: Title is missing");
                alert("Title is required.");
                return;
            }

            let fileId = null;
            if (data.image?.[0]) {
                const file = await appwriteService.uploadFile(data.image[0]);
                if (file) fileId = file.$id;
            }

            if (post) {
                if (fileId) {
                    await appwriteService.deleteFile(post.featuredImage);
                }
                const updatedPost = await appwriteService.updatePost(post.$id, {
                    ...data,
                    featuredImage: fileId || post.featuredImage,
                });
                if (updatedPost) {
                    console.log("Post Updated:", updatedPost);
                    navigate(`/post/${updatedPost.$id}`);
                }
            } else {
                const newPost = await appwriteService.createPost({
                    ...data,
                    userId: userData?.$id,
                    featuredImage: fileId,
                });
                if (newPost) {
                    console.log("New Post Created:", newPost);
                    navigate(`/post/${newPost.$id}`);
                }
            }
        } catch (error) {
            console.error("Error in Post Submission:", error);
            alert("An error occurred. Please check the console for details.");
        }
    };

    const slugTransform = useCallback((value) => {
        if (value && typeof value === "string") {
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "-")
                .replace(/\s/g, "-");
        }
        return "";
    }, []);

    React.useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "title") {
                setValue("slug", slugTransform(value.title), { shouldValidate: true });
            }
        });
        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);

    return (
        <form
            onSubmit={handleSubmit(submit)}
            className="flex flex-wrap md:flex-row md:justify-between space-y-4 md:space-y-0"
        >
            <div className="w-full md:w-2/3 px-2">
                <Input
                    label="Title :"
                    placeholder="Title"
                    className="mb-4"
                    {...register("title", { required: true })}
                />
                <Input
                    label="Slug :"
                    placeholder="Slug"
                    className="mb-4"
                    {...register("slug", { required: true })}
                    onInput={(e) => {
                        setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                    }}
                />
                <RTE
                    label="Content :"
                    name="content"
                    control={control}
                    defaultValue={getValues("content")}
                    className="w-full"
                />
            </div>
            <div className="w-full md:w-1/3 px-2">
                <Input
                    label="Featured Image :"
                    type="file"
                    className="mb-4"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    {...register("image")}
                />
                {post && post.featuredImage && (
                    <div className="w-full mb-4">
                        <img
                            src={appwriteService.getFilePreview(post.featuredImage)}
                            alt={post.title}
                            className="rounded-lg max-w-full h-auto"
                        />
                    </div>
                )}
                <Select
                    options={["active", "inactive"]}
                    label="Status"
                    className="mb-4"
                    {...register("status", { required: true })}
                />
                <Button
                    type="submit"
                    bgColor={post ? "bg-green-500" : undefined}
                    className="w-full"
                >
                    {post ? "Update" : "Submit"}
                </Button>
            </div>
        </form>
    );
}
