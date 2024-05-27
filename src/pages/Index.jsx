import React, { useEffect, useState } from "react";
import { Container, VStack, Text, Link, Spinner, Box, Heading } from "@chakra-ui/react";
import { FaHackerNews } from "react-icons/fa";

const Index = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json");
        const storyIds = await response.json();
        const storiesPromises = storyIds.slice(0, 10).map(async (id) => {
          const storyResponse = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
          return await storyResponse.json();
        });
        const stories = await Promise.all(storiesPromises);
        setStories(stories);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching stories:", error);
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <VStack spacing={4}>
        <Heading as="h1" size="xl" display="flex" alignItems="center">
          <FaHackerNews style={{ marginRight: "8px" }} />
          Latest Hacker News Stories
        </Heading>
        {loading ? (
          <Spinner size="xl" />
        ) : (
          stories.map((story) => (
            <Box key={story.id} p={4} borderWidth="1px" borderRadius="lg" width="100%">
              <Link href={story.url} isExternal fontSize="lg" fontWeight="bold">
                {story.title}
              </Link>
              <Text fontSize="sm" color="gray.500">
                By {story.by} | {new Date(story.time * 1000).toLocaleString()}
              </Text>
            </Box>
          ))
        )}
      </VStack>
    </Container>
  );
};

export default Index;
