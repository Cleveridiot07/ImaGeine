import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { AutoAwesome, CreateRounded } from "@mui/icons-material";
import TextInput from "../Input/TextInput";
import Button from "../buttons/button";
import { CreatePost, GenerateImageFromPrompt } from "../../api";

// Styled components
const Form = styled.div`
  flex: 1;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 9%;
  justify-content: center;
`;

const Top = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Title = styled.div`
  text-align: center;
  width: 100%;
  font-size: 28px;
  font-weight: 500;
  color: ${({ theme }) => theme.black};
`;

const Desc = styled.div`
  font-size: 17px;
  font-weight: 400;
  color: ${({ theme }) => theme.text_secondary};
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.text_secondary};
`;

const Actions = styled.div`
  display: flex;
  flex: 1;
  gap: 8px;
`;

const GenerateImage = ({
  createPostLoading,
  setcreatePostLoading,
  generateImageLoading,
  setGenerateImageLoading,
  post,
  setPost,
}) => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const generateImage = async () => {
    setGenerateImageLoading(true);
    setError("");
    try {
      const res = await GenerateImageFromPrompt({ prompt: post.prompt });
      console.log("API Response:", res);

      const assetUrl = res.data[0]?.asset_url;
      if (assetUrl) {
        console.log(assetUrl)
        setPost({
          ...post,
          photo: assetUrl,
        });
      } else {
        setError("Failed to generate image URL");
      }

      setGenerateImageLoading(false);
    } catch (error) {
      console.log("Test",error);
      setError(error?.message || "Error in generating image");
      setGenerateImageLoading(false);
    }
  };

  const createPost = async () => {
    setcreatePostLoading(true);
    setError("");
    try {
      await CreatePost(post);
      navigate("/");
      setcreatePostLoading(false);
    } catch (error) {
      setError(error?.response?.data?.message || "Error creating post");
      setcreatePostLoading(false);
    }
  };

  return (
    <Form>
      <Top>
        <Title>Generate Image using prompt</Title>
        <Desc>
          Provide a prompt for generating the image.
        </Desc>
      </Top>
      <Body>
        <TextInput
          label="Author"
          placeholder="Enter your name"
          name="name"
          value={post.name}
          handelChange={(e) => setPost({ ...post, name: e.target.value })}
        />
        <TextInput
          label="Image Prompt"
          placeholder="Write a detailed prompt about the image"
          name="prompt"
          textArea
          rows="8"
          value={post.prompt}
          handelChange={(e) => setPost({ ...post, prompt: e.target.value })}
        />
        {error && <div style={{ color: "red" }}>{error}</div>}* You can post the
        AI Generated Image to showcase in the community!
      </Body>
      <Actions>
        <Button
          text="Generate Image"
          leftIcon={<AutoAwesome />}
          flex
          isLoading={generateImageLoading}
          isDisabled={post.prompt === ""}
          onClick={generateImage}
        />
        <Button
          text="Post Image"
          leftIcon={<CreateRounded />}
          type="secondary"
          flex
          isDisabled={
            post.name === "" || post.photo === "" || post.prompt === ""
          }
          isLoading={createPostLoading}
          onClick={createPost}
        />
      </Actions>
    </Form>
  );
};

export default GenerateImage;
