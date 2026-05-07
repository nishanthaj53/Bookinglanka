import mainImage from '../assets/images/blog/blog-4-1.jpg';
import smallImage1 from '../assets/images/blog/blog-s-4-1.jpg';
import smallImage2 from '../assets/images/blog/blog-s-4-2.jpg';


const blogTwoData = {
  sectionTagline: 'Travel Guide & News',
  sectionTitle: 'Discover Sri Lanka <span>Travel Stories</span>',
  buttonText: 'Read All Articles',
  buttonLink: '/blog-details-left',

  mainBlog: {
    image: mainImage,
    date: { day: '28', month: 'Feb' },
    author: 'Travel Team',
    category: 'Destinations',
    title: 'Top 5 Must-Visit Destinations in Sri Lanka',
    link: '/blog-details-right',
  },

  blogs: [
    {
      image: smallImage1,
      date: { day: '20', month: 'Feb' },
      author: 'Travel Team',
      category: 'Culture',
      title: 'Exploring Ancient Temples: A Spiritual Journey',
      link: '/blog-details-right',
    },
    {
      image: smallImage2,
      date: { day: '15', month: 'Feb' },
      author: 'Travel Team',
      category: 'Beach Guide',
      title: 'Best Beaches for Surfing and Relaxation',
      link: '/blog-details-right',
    },
  ],
};

export default blogTwoData;
