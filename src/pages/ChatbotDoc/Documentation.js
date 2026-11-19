import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Documentation = () => {
    const [text, setText] = useState('');

    useEffect(() => {
        const fetchDocumentation = async () => {
            try {
                const response = await axios.get('/textfile');
                setText(response.data);
            } catch (error) {
                console.error('Error fetching documentation:', error);
            }
        };

        fetchDocumentation();
    }, []);

    return (
        <div>
            <h1>Documentation</h1>
            <pre>{text}</pre> {/* Display the text with preformatted style */}
        </div>
    );
};

export default Documentation;