import { Box, Card, CardContent, CardHeader, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiGetDiscussionByID } from "../api/apis";
import { getToken } from "../components/Token";
import DiscussionComments from "../components/DiscussionComments";

export default function DiscussionDetailsPage() {
  const token = getToken();
  const { discussionid } = useParams();
  const [discussion, setDiscussion] = useState();
  //   console.log(discussion);

  useEffect(() => {
    const fetchData = async (discussionid) => {
      const [, discussion] = await apiGetDiscussionByID(token, discussionid);
      setDiscussion(discussion);
    };

    fetchData(discussionid);
  }, [token, discussionid]);

  return (
    <>
      {discussion && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            margin: "5% 5% 0 5%",
          }}
        >
          <Card
            sx={{
              display: "flex",
              flexDirection: "column",
              width: { xs: "100%", sm: "90%", md: 700 },
              padding: "0 10px 0 10px",
            }}
          >
            <CardHeader title={discussion.title} />
            <CardContent>
              <Typography>{discussion.content}</Typography>
            </CardContent>
          </Card>
          <DiscussionComments discussionid={discussionid} />
        </Box>
      )}
    </>
  );
}
