import React, { Component } from 'react';
import { client, Status, GenerationStyle } from 'imaginesdk';  // Adjusted the import statement

export default class AI extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      error: null,
      isLoading: true,
    };
  }

  async componentDidMount() {
    this.imagine = client('vk-zD6gxCUD3ZSuxnZmMWGqRk3gx5Mq7csyk1G5caf2yFmNwM');  // Initialize the client with your API key
    try {
      const response = await this.imagine.generations('cat with big sword', {
        style: GenerationStyle.IMAGINE_V5,
      });

      console.log('API Response:', response);

      if (response.status() === Status.OK) {
        const imageBuffer = await response.data();  // Ensure to await the data method
        const image = new Blob([imageBuffer], { type: 'image/jpeg' });
        this.setState({ image, isLoading: false });
      } else {
        console.log(`Status Code: ${response.status()}`);
        this.setState({ error: `Status Code: ${response.status()}`, isLoading: false });
      }
    } catch (error) {
      console.error('Error fetching image:', error);
      this.setState({ error: error.message, isLoading: false });
    }
  }

  render() {
    const { image, error, isLoading } = this.state;

    return (
      <div>
        {isLoading ? (
          <p>Loading image...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          <img src={URL.createObjectURL(image)} alt="Generated" />
        )}
      </div>
    );
  }
}
