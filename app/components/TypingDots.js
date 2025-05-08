 import { useEffect,useState } from 'react';
 import { StyleSheet,View } from 'react-native';


  const TypingDots = () => {
    const [dots, setDots] = useState('');
    useEffect(() => {
      const interval = setInterval(() => {
        setDots((prev) => (prev.length < 3 ? prev + '.' : ''));
      }, 500);
      return () => clearInterval(interval);
    }, []);
    return (
      <View style={styles.typingContainer}>
        <View style={styles.typingBubble}>
          <View style={styles.typingDot} />
          <View style={styles.typingDot} />
          <View style={styles.typingDot} />
        </View>
      </View>
    );
  };

  const styles=StyleSheet.create({
    typingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      typingBubble: {
        flexDirection: 'row',
        padding: 10,
      },
      typingDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#7c4dff',
        marginHorizontal: 2,
      },
  });

  export default TypingDots;