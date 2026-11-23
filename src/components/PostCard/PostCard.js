import React from 'react';
import { Button, Card } from 'react-bootstrap';
import { format, parseISO } from 'date-fns';
import { convertCommentFromJSONToHTML } from '../../utils/convertCommentFromJSONToHTML';

const PostCard = ({ post, toggleContent }) => {
  const parsedDate = parseISO(post.date);
  const formattedDate = format(parsedDate, 'EEEE dd LLLL yyyy');
  const formattedTime = format(parsedDate, 'HH:mm');
  const formattedText = convertCommentFromJSONToHTML(post.content);

  return (
    <Card className="mb-4">
      <Card.Body>
        <Card.Title>{post.title}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          {formattedDate} at {formattedTime} by {post.username}
        </Card.Subtitle>
        {(post.category || post.tags?.length > 0) && (
          <div className="mb-2 text-muted">
            {post.category && <span className="me-2">Category: {post.category}</span>}
            {post.tags?.length > 0 && <span>Tags: {post.tags.join(', ')}</span>}
          </div>
        )}
        <Card.Img className="image" variant="top" src={post.image} />
        <Card.Text className="post-content">
          <div dangerouslySetInnerHTML={{ __html: formattedText }} />
        </Card.Text>
        <div className="icon-row">
          <Button className="rounded-pill btn-green" variant="secondary" onClick={() => toggleContent(post)}>
            Show More
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default PostCard;