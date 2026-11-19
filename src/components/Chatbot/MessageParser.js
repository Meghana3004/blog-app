import React from 'react';

const MessageParser = ({ children, actions }) => {
 
  const parse = (message) => {
    console.log(message);
    actions.handleHello();
  };

  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          parse: parse,
          actions,
        });
      })}

    </div>
  );
};

export default MessageParser;



// import React from 'react';

// const MessageParser = ({ children, actions }) => {
//   const parse = async (message) => {
//     console.log(message);
//     actions.handleHello(message);
//     try {
//       const response = await fetch('https://4gm39v5htc.execute-api.eu-west-1.amazonaws.com/dev/v1', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'x-api-key': 'TqZhXFLTj29RmIspAVa3j9USVEDCMZJN4RKrpkS9',
//         },
//         body: JSON.stringify({ user_query: message }),
//       });
//       if (!response.ok) {
//         throw new Error('Failed to fetch data');
//       }
//       const responseData = await response.json();
//       console.log(responseData); 

//       actions.handleResponse(responseData);

//     } catch (error) {
//       console.error('Error fetching data:', error.message);

//     }
//   };

//   return (
//     <div>
//       {React.Children.map(children, (child) => {
//         return React.cloneElement(child, {
//           parse: parse,
//           actions,
//         });
//       })}
//     </div>
//   );
// };

// export default MessageParser;



