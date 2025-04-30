import clientPromise from './mongodb';
import { BlogPost, Profile, Topic } from './models';

// Initial blog posts data
const initialPosts: Omit<BlogPost, '_id'>[] = [
  {
    title: 'How LLMs Work',
    slug: 'how-llm-works',
    excerpt: 'An in-depth look at the architecture and functioning of Large Language Models.',
    content: `# How Large Language Models Work

Large Language Models (LLMs) like GPT-4, Claude, and LLaMA have revolutionized AI capabilities. Let's explore how they work.

## Architecture

LLMs are based on the Transformer architecture, which uses self-attention mechanisms to process sequences of text.

{:code-block}
{:python}
import torch
import torch.nn as nn

class SelfAttention(nn.Module):
    def __init__(self, embed_size, heads):
        super(SelfAttention, self).__init__()
        self.embed_size = embed_size
        self.heads = heads
        self.head_dim = embed_size // heads
        
        self.values = nn.Linear(self.head_dim, self.head_dim, bias=False)
        self.keys = nn.Linear(self.head_dim, self.head_dim, bias=False)
        self.queries = nn.Linear(self.head_dim, self.head_dim, bias=False)
        self.fc_out = nn.Linear(heads * self.head_dim, embed_size)
        
    def forward(self, values, keys, query, mask):
        # Implementation details...
        pass

## Training Process

LLMs are trained using a process called self-supervised learning, where they predict the next token in a sequence.

## Applications

LLMs can be used for:
- Text generation
- Translation
- Summarization
- Question answering
- Code generation

## Limitations

Despite their capabilities, LLMs have several limitations:
1. They can generate incorrect information (hallucinations)
2. They lack true understanding of the world
3. They can reflect biases present in their training data`,
    category: 'AI',
    accentColor: '#6C63FF',
    status: 'published',
    views: 1250,
    createdAt: new Date('2023-06-15').toISOString(),
    publishedAt: new Date('2023-06-20').toISOString(),
    author: 'Developer',
    tags: ['AI', 'NLP', 'Machine Learning']
  },
  {
    title: 'Building Neural Networks from Scratch',
    slug: 'neural-network-from-scratch',
    excerpt: 'Learn how to implement a neural network using only NumPy.',
    content: `# Building a Neural Network from Scratch

In this tutorial, we'll implement a simple neural network using only NumPy.

## The Building Blocks

A neural network consists of layers of neurons, weights, and activation functions.

{:code-block}
{:python}
import numpy as np

class NeuralNetwork:
    def __init__(self, input_size, hidden_size, output_size):
        self.W1 = np.random.randn(input_size, hidden_size) * 0.01
        self.b1 = np.zeros((1, hidden_size))
        self.W2 = np.random.randn(hidden_size, output_size) * 0.01
        self.b2 = np.zeros((1, output_size))
        
    def forward(self, X):
        # Forward pass
        self.z1 = np.dot(X, self.W1) + self.b1
        self.a1 = np.tanh(self.z1)
        self.z2 = np.dot(self.a1, self.W2) + self.b2
        self.a2 = self._sigmoid(self.z2)
        return self.a2
        
    def _sigmoid(self, x):
        return 1 / (1 + np.exp(-x))

## Training the Network

We'll use backpropagation and gradient descent to train our network.

{:code-block}
{:python}
def train(self, X, y, learning_rate=0.01, epochs=1000):
    for epoch in range(epochs):
        # Forward pass
        output = self.forward(X)
        
        # Compute loss
        loss = -np.mean(y * np.log(output) + (1 - y) * np.log(1 - output))
        
        # Backpropagation
        dz2 = output - y
        dW2 = np.dot(self.a1.T, dz2) / X.shape[0]
        db2 = np.sum(dz2, axis=0, keepdims=True) / X.shape[0]
        
        # Update weights
        self.W2 -= learning_rate * dW2
        self.b2 -= learning_rate * db2
        
        if epoch % 100 == 0:
            print(f"Epoch {epoch}, Loss: {loss}")

## Testing on Real Data

Let's test our implementation on the XOR problem.`,
    category: 'DEEP_LEARNING',
    accentColor: '#FF5252',
    status: 'published',
    views: 980,
    createdAt: new Date('2023-07-10').toISOString(),
    publishedAt: new Date('2023-07-15').toISOString(),
    author: 'Developer',
    tags: ['Neural Networks', 'Deep Learning', 'Python']
  },
  {
    title: 'The Future of Quantum Computing in AI',
    slug: 'future-quantum-computing',
    excerpt: 'Exploring how quantum computing could revolutionize artificial intelligence.',
    content: `# The Future of Quantum Computing in AI

Quantum computing promises to revolutionize many fields, including artificial intelligence.

## Quantum Computing Basics

Quantum computers use quantum bits or qubits, which can exist in multiple states simultaneously.

{:code-block}
{:python}
from qiskit import QuantumCircuit, Aer, execute

# Create a quantum circuit with 2 qubits
qc = QuantumCircuit(2, 2)

# Apply Hadamard gate to the first qubit
qc.h(0)

# Apply CNOT gate with control qubit 0 and target qubit 1
qc.cx(0, 1)

# Measure the qubits
qc.measure([0, 1], [0, 1])

# Simulate the circuit
simulator = Aer.get_backend('qasm_simulator')
job = execute(qc, simulator, shots=1000)
result = job.result()
counts = result.get_counts(qc)
print(counts)

## Quantum Machine Learning

Quantum machine learning algorithms could potentially solve problems that are intractable for classical computers.

## Challenges and Opportunities

While quantum computing holds great promise, there are significant challenges to overcome:

1. Quantum decoherence
2. Error correction
3. Scaling up quantum systems

## Timeline for Practical Applications

Experts predict that practical quantum advantage for AI applications might be realized within the next 5-10 years.`,
    category: 'QUANTUM_COMPUTING',
    accentColor: '#06D6A0',
    status: 'published',
    views: 750,
    createdAt: new Date('2023-08-05').toISOString(),
    publishedAt: new Date('2023-08-10').toISOString(),
    author: 'Developer',
    tags: ['Quantum Computing', 'AI', 'Future Tech']
  }
];

// Initial profiles data (Who to Follow)
const initialProfiles: Omit<Profile, '_id'>[] = [
  {
    name: 'Fareed Khan',
    bio: 'I write on AI',
    link: 'https://www.linkedin.com/in/fareed-khan',
    imageUrl: '/images/profiles/fareed.jpg',
  },
  {
    name: 'Level Up Coding',
    bio: 'Publication',
    description: 'Coding tutorials and news. The developer homepage.',
    link: 'https://levelup.gitconnected.com',
    imageUrl: '/images/profiles/levelup.jpg',
  },
  {
    name: "Let's Code Future",
    bio: 'Sachin Maurya | Frontend Developer & Tech Writer',
    link: 'https://letscode.future.com',
    imageUrl: '/images/profiles/sachin.jpg',
  },
];

// Initial topics data
const initialTopics: Topic[] = [
  {
    id: 'all',
    name: 'All',
  },
  {
    id: 'MACHINE_LEARNING',
    name: 'Machine Learning',
  },
  {
    id: 'REINFORCEMENT_LEARNING',
    name: 'Reinforcement Learning',
  },
  {
    id: 'DATA_SCIENCE',
    name: 'Data Science',
  },
  {
    id: 'QUANTUM_COMPUTING',
    name: 'Quantum Computing',
  },
  {
    id: 'CODING',
    name: 'Coding',
  },
  {
    id: 'AI_ETHICS',
    name: 'AI Ethics',
  },
  {
    id: 'ARTIFICIAL_INTELLIGENCE',
    name: 'Artificial Intelligence',
  },
  {
    id: 'DEEP_LEARNING',
    name: 'Deep Learning',
  },
];

// Initial admin user
const initialUser = {
  username: 'psadmin',
  password: 'ps123',
  role: 'admin',
};

// Function to seed the database
export async function seedDatabase() {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    // Check if collections exist and have data
    const postsCount = await db.collection('posts').countDocuments();
    const profilesCount = await db.collection('profiles').countDocuments();
    const topicsCount = await db.collection('topics').countDocuments();
    const usersCount = await db.collection('users').countDocuments();
    
    // Seed posts if empty
    if (postsCount === 0) {
      await db.collection('posts').insertMany(initialPosts);
      console.log('Seeded posts collection');
    }
    
    // Seed profiles if empty
    if (profilesCount === 0) {
      await db.collection('profiles').insertMany(initialProfiles);
      console.log('Seeded profiles collection');
    }
    
    // Seed topics if empty
    if (topicsCount === 0) {
      await db.collection('topics').insertMany(initialTopics);
      console.log('Seeded topics collection');
    }
    
    // Seed users if empty
    if (usersCount === 0) {
      await db.collection('users').insertOne(initialUser);
      console.log('Seeded users collection');
    }
    
    console.log('Database seeding completed');
    return { success: true };
  } catch (error) {
    console.error('Error seeding database:', error);
    return { success: false, error };
  }
}

// Export a function to run the seeding process
export default async function runSeed() {
  const result = await seedDatabase();
  return result;
}
