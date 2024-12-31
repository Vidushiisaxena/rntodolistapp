import { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import DraggableFlatList from 'react-native-draggable-flatlist';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export default function HomeScreen() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const colorScheme = useColorScheme() ?? 'light';

  const addTodo = () => {
    if (newTodo.trim() === '') return;
    
    const todo: Todo = {
      id: Date.now().toString(),
      text: newTodo.trim(),
      completed: false
    };
    
    setTodos([...todos, todo]);
    setNewTodo('');
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const clearAllTodos = () => {
    setTodos([]);
  };

  const renderTodoItem = ({ item }: { item: Todo }) => (
    <ThemedView style={styles.todoItem}>
      <TouchableOpacity 
        style={styles.todoCheckbox}
        onPress={() => toggleTodo(item.id)}
      >
        {item.completed && (
          <IconSymbol 
            name="checkmark.circle.fill" 
            size={24} 
            color={Colors[colorScheme].tint}
          />
        )}
        {!item.completed && (
          <ThemedView style={styles.emptyCheckbox} />
        )}
      </TouchableOpacity>
      
      <ThemedText 
        style={[
          styles.todoText,
          item.completed && styles.completedTodoText
        ]}
      >
        {item.text}
      </ThemedText>
      
      <TouchableOpacity 
        onPress={() => deleteTodo(item.id)}
        style={styles.deleteButton}
      >
        <IconSymbol 
          name="trash.fill" 
          size={20} 
          color={Colors[colorScheme].icon}
        />
      </TouchableOpacity>
    </ThemedView>
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Todo List</ThemedText>
        {todos.length > 0 && (
          <TouchableOpacity onPress={clearAllTodos}>
            <ThemedText type="link">Clear All</ThemedText>
          </TouchableOpacity>
        )}
      </ThemedView>

      <ThemedView style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newTodo}
          onChangeText={setNewTodo}
          placeholder="Add a new todo..."
          placeholderTextColor={Colors[colorScheme].icon}
          onSubmitEditing={addTodo}
        />
        <TouchableOpacity 
          style={[
            styles.addButton,
            { backgroundColor: Colors[colorScheme].tint }
          ]} 
          onPress={addTodo}
        >
          <ThemedText style={styles.addButtonText}>Add</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <FlatList
        data={todos}
        renderItem={renderTodoItem}
        keyExtractor={(item: Todo) => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 46,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 10,
  },
  addButton: {
    paddingHorizontal: 20,
    height: 46,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  list: {
    flex: 1,
  },
  listContent: {
    gap: 12,
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  todoCheckbox: {
    width: 24,
    height: 24,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCheckbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderRadius: 12,
    borderColor: '#ccc',
  },
  todoText: {
    flex: 1,
    fontSize: 16,
  },
  completedTodoText: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  deleteButton: {
    padding: 4,
  },
});