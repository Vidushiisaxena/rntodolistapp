import { useState, useCallback } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Animated } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import DraggableFlatList, { 
  ScaleDecorator,
  RenderItemParams,
} from 'react-native-draggable-flatlist';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

interface TodoItemProps {
  item: Todo;
  drag: () => void;
  isActive: boolean;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

const TodoItem = ({ item, drag, isActive, onDelete, onToggle }: TodoItemProps) => {
  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    const trans = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    return (
      <TouchableOpacity 
        style={styles.deleteButton} 
        onPress={() => onDelete(item.id)}
      >
        <Animated.Text style={[styles.deleteText, { transform: [{ scale: trans }] }]}>
          Delete
        </Animated.Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScaleDecorator>
      <Swipeable renderRightActions={renderRightActions}>
        <TouchableOpacity
          onLongPress={drag}
          disabled={isActive}
          onPress={() => onToggle(item.id)}
          style={[
            styles.todoItem,
            { backgroundColor: isActive ? '#FFE4E1' : 'white' }
          ]}
        >
          <ThemedView style={styles.todoCheckbox}>
            {item.completed ? (
              <IconSymbol name="checkmark.circle.fill" size={24} color="#FF69B4" />
            ) : (
              <ThemedView style={styles.emptyCheckbox} />
            )}
          </ThemedView>
          <ThemedText style={[
            styles.todoText,
            item.completed && styles.completedTodoText
          ]}>
            {item.text}
          </ThemedText>
        </TouchableOpacity>
      </Swipeable>
    </ScaleDecorator>
  );
};

export default function HomeScreen() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [inputScale] = useState(new Animated.Value(1));
  const [buttonScale] = useState(new Animated.Value(1));

  const animateInput = () => {
    Animated.sequence([
      Animated.spring(inputScale, {
        toValue: 1.02,
        useNativeDriver: true,
      }),
      Animated.spring(inputScale, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateButton = () => {
    Animated.sequence([
      Animated.spring(buttonScale, {
        toValue: 0.95,
        useNativeDriver: true,
      }),
      Animated.spring(buttonScale, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const addTodo = () => {
    if (newTodo.trim() === '') return;
    animateButton();
    const todo: Todo = {
      id: Date.now().toString(),
      text: newTodo.trim(),
      completed: false
    };
    setTodos([...todos, todo]);
    setNewTodo('');
  };

  const onDragEnd = useCallback(({ data }: { data: Todo[] }) => {
    setTodos(data);
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos(current => current.filter(todo => todo.id !== id));
  }, []);

  const toggleTodo = useCallback((id: string) => {
    setTodos(current =>
      current.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemedView style={styles.container}>
        <ThemedText style={styles.title}>Todo List</ThemedText>

        <Animated.View style={[styles.inputContainer, { transform: [{ scale: inputScale }] }]}>
          <TextInput
            style={styles.input}
            value={newTodo}
            onChangeText={setNewTodo}
            placeholder="Add a new todo..."
            placeholderTextColor="#FF69B4"
            onFocus={animateInput}
            onSubmitEditing={addTodo}
          />
          <TouchableOpacity 
            style={styles.addButton}
            onPress={addTodo}
            activeOpacity={0.7}
          >
            <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
              <ThemedText style={styles.addButtonText}>Add</ThemedText>
            </Animated.View>
          </TouchableOpacity>
        </Animated.View>

        <ThemedText style={[styles.motivationalText, { opacity: newTodo.length > 0 ? 1 : 0.7 }]}>
          {newTodo.length > 0 ? "That's a great task! 🌟" : "You can do it! ✨"}
        </ThemedText>

        {todos.length > 0 ? (
          <DraggableFlatList
            data={todos}
            onDragEnd={onDragEnd}
            keyExtractor={item => item.id}
            renderItem={({ item, drag, isActive }) => (
              <TodoItem
                item={item}
                drag={drag}
                isActive={isActive}
                onDelete={deleteTodo}
                onToggle={toggleTodo}
              />
            )}
          />
        ) : (
          <ThemedView style={styles.emptyState}>
            <ThemedText style={styles.emptyText}>
              Ready to start your productive day? 🌈
            </ThemedText>
          </ThemedView>
        )}
      </ThemedView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#E6E6FA',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#000',
    shadowColor: '#FF69B4',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  addButton: {
    backgroundColor: '#FF69B4',
    paddingHorizontal: 24,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF69B4',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  motivationalText: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#FF69B4',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  todoCheckbox: {
    width: 24,
    height: 24,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCheckbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: '#FF69B4',
  },
  todoText: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  completedTodoText: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  deleteButton: {
    backgroundColor: '#FF4444',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
    borderRadius: 12,
  },
  deleteText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
});
