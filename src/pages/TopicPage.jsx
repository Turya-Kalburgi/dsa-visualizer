import Navbar from '../components/Navbar'
import Editor from '@monaco-editor/react'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { arrayProblems } from '../data/dsaRoadmap'

const patternOptions = [
  'HashSet',
  'HashMap',
  'Two Pointers',
  'Sliding Window',
  'Prefix Sum',
  "Kadane's Algorithm",
  'Dutch Flag',
  'Monotonic Stack'
]

const patternMeta = {
  HashSet: {
    description: 'HashSet is a fast way to track whether a value has appeared before. It is ideal when you only care about existence and duplicates.',
    whenToUse: 'Use it when you need to check membership or detect duplicates in O(1) average time.',
    complexity: 'O(n) average'
  },
  HashMap: {
    description: 'HashMap stores values in key-value pairs so you can look up a needed value instantly. It is a staple for frequency and complement-style problems.',
    whenToUse: 'Use it when you want to remember seen values and retrieve them by their complement or index.',
    complexity: 'O(n) average'
  },
  'Two Pointers': {
    description: 'Two Pointers uses two indexes moving toward each other or in one direction to shrink the search space. It shines on sorted arrays and in-place problems.',
    whenToUse: 'Use it when you need to compare values from both ends or move through a list efficiently.',
    complexity: 'O(n)'
  },
  'Sliding Window': {
    description: 'Sliding Window keeps a moving block of values in view and updates a running total as it shifts. It is perfect for subarray and substring questions with a fixed size.',
    whenToUse: 'Use it when you need to evaluate a contiguous chunk of an array without recomputing from scratch.',
    complexity: 'O(n)'
  },
  'Prefix Sum': {
    description: 'Prefix Sum builds cumulative totals so future range queries become constant-time lookups. It turns repeated subarray sum questions into simple arithmetic.',
    whenToUse: 'Use it when you need many range-sum queries or want to compare left and right parts quickly.',
    complexity: 'O(n)'
  },
  "Kadane's Algorithm": {
    description: 'Kadane\'s Algorithm tracks the best subarray ending at each index. It resets when a running sum starts hurting the answer.',
    whenToUse: 'Use it when you need the maximum subarray sum or the best contiguous segment.',
    complexity: 'O(n)'
  },
  'Dutch Flag': {
    description: 'Dutch Flag partitions the array into low, middle, and high regions in a single pass. It is the classic way to sort 0s, 1s, and 2s without extra memory.',
    whenToUse: 'Use it when the array contains a few distinct values and you want one-pass partitioning.',
    complexity: 'O(n)'
  },
  'Monotonic Stack': {
    description: 'Monotonic Stack keeps values in an order that helps answer next-greater or previous-greater questions. It is ideal for histogram and nearest-boundary problems.',
    whenToUse: 'Use it when you need to reason about the next greater element or build a structure from the left.',
    complexity: 'O(n)'
  }
}

const starterTemplates = {
  HashSet: {
    javascript: `function hasDuplicate(arr) {
  const seen = new Set()

  for (const value of arr) {
    if (seen.has(value)) return true
    seen.add(value)
  }

  return false
}`,
    python: `def has_duplicate(arr):
    seen = set()

    for value in arr:
        if value in seen:
            return True
        seen.add(value)

    return False`,
    java: `class Solution {
    public boolean hasDuplicate(int[] arr) {
        Set<Integer> seen = new HashSet<>();
        for (int value : arr) {
            if (seen.contains(value)) return true;
            seen.add(value);
        }
        return false;
    }
}`,
    cpp: `class Solution {
public:
    bool hasDuplicate(vector<int>& arr) {
        unordered_set<int> seen;
        for (int value : arr) {
            if (seen.count(value)) return true;
            seen.insert(value);
        }
        return false;
    }
};`
  },
  HashMap: {
    javascript: `function twoSum(arr, target) {
  const seen = new Map()

  for (let i = 0; i < arr.length; i++) {
    const complement = target - arr[i]
    if (seen.has(complement)) return [seen.get(complement), i]
    seen.set(arr[i], i)
  }

  return []
}`,
    python: `def two_sum(arr, target):
    seen = {}

    for index, value in enumerate(arr):
        complement = target - value
        if complement in seen:
            return [seen[complement], index]
        seen[value] = index

    return []`,
    java: `class Solution {
    public int[] twoSum(int[] arr, int target) {
        Map<Integer, Integer> seen = new HashMap<>();
        for (int i = 0; i < arr.length; i++) {
            int complement = target - arr[i];
            if (seen.containsKey(complement)) return new int[]{seen.get(complement), i};
            seen.put(arr[i], i);
        }
        return new int[]{};
    }
}`,
    cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& arr, int target) {
        unordered_map<int, int> seen;
        for (int i = 0; i < arr.size(); i++) {
            int complement = target - arr[i];
            if (seen.count(complement)) return {seen[complement], i};
            seen[arr[i]] = i;
        }
        return {};
    }
};`
  },
  'Two Pointers': {
    javascript: `function twoSum(arr, target) {
  let left = 0
  let right = arr.length - 1

  while (left < right) {
    const sum = arr[left] + arr[right]
    if (sum < target) left += 1
    else if (sum > target) right -= 1
    else return [left, right]
  }

  return []
}`,
    python: `def two_sum(arr, target):
    left, right = 0, len(arr) - 1

    while left < right:
        total = arr[left] + arr[right]
        if total < target:
            left += 1
        elif total > target:
            right -= 1
        else:
            return [left, right]

    return []`,
    java: `class Solution {
    public int[] twoSum(int[] arr, int target) {
        int left = 0;
        int right = arr.length - 1;

        while (left < right) {
            int sum = arr[left] + arr[right];
            if (sum < target) left++;
            else if (sum > target) right--;
            else return new int[]{left, right};
        }

        return new int[]{};
    }
}`,
    cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& arr, int target) {
        int left = 0;
        int right = arr.size() - 1;

        while (left < right) {
            int sum = arr[left] + arr[right];
            if (sum < target) left++;
            else if (sum > target) right--;
            else return {left, right};
        }

        return {};
    }
};`
  },
  'Sliding Window': {
    javascript: `function maxSum(arr, k) {
  let windowSum = arr.slice(0, k).reduce((a, b) => a + b, 0)
  let best = windowSum

  for (let i = k; i < arr.length; i++) {
    windowSum += arr[i] - arr[i - k]
    best = Math.max(best, windowSum)
  }

  return best
}`,
    python: `def max_sum(arr, k):
    window_sum = sum(arr[:k])
    best = window_sum

    for i in range(k, len(arr)):
        window_sum += arr[i] - arr[i - k]
        best = max(best, window_sum)

    return best`,
    java: `class Solution {
    public int maxSum(int[] arr, int k) {
        int windowSum = 0;
        for (int i = 0; i < k; i++) windowSum += arr[i];

        int best = windowSum;
        for (int i = k; i < arr.length; i++) {
            windowSum += arr[i] - arr[i - k];
            best = Math.max(best, windowSum);
        }

        return best;
    }
}`,
    cpp: `class Solution {
public:
    int maxSum(vector<int>& arr, int k) {
        int windowSum = 0;
        for (int i = 0; i < k; i++) windowSum += arr[i];

        int best = windowSum;
        for (int i = k; i < arr.size(); i++) {
            windowSum += arr[i] - arr[i - k];
            best = max(best, windowSum);
        }

        return best;
    }
};`
  },
  'Prefix Sum': {
    javascript: `function rangeSum(prefix, left, right) {
  return prefix[right + 1] - prefix[left]
}`,
    python: `def range_sum(prefix, left, right):
    return prefix[right + 1] - prefix[left]`,
    java: `class Solution {
    public int rangeSum(int[] prefix, int left, int right) {
        return prefix[right + 1] - prefix[left];
    }
}`,
    cpp: `class Solution {
public:
    int rangeSum(vector<int>& prefix, int left, int right) {
        return prefix[right + 1] - prefix[left];
    }
};`
  },
  "Kadane's Algorithm": {
    javascript: `function maxSubarray(arr) {
  let current = arr[0]
  let best = arr[0]

  for (let i = 1; i < arr.length; i++) {
    current = Math.max(arr[i], current + arr[i])
    best = Math.max(best, current)
  }

  return best
}`,
    python: `def max_subarray(arr):
    current = arr[0]
    best = arr[0]

    for i in range(1, len(arr)):
        current = max(arr[i], current + arr[i])
        best = max(best, current)

    return best`,
    java: `class Solution {
    public int maxSubarray(int[] arr) {
        int current = arr[0];
        int best = arr[0];
        for (int i = 1; i < arr.length; i++) {
            current = Math.max(arr[i], current + arr[i]);
            best = Math.max(best, current);
        }
        return best;
    }
}`,
    cpp: `class Solution {
public:
    int maxSubarray(vector<int>& arr) {
        int current = arr[0];
        int best = arr[0];
        for (int i = 1; i < arr.size(); i++) {
            current = max(arr[i], current + arr[i]);
            best = max(best, current);
        }
        return best;
    }
};`
  },
  'Dutch Flag': {
    javascript: `function sortColors(nums) {
  let low = 0
  let mid = 0
  let high = nums.length - 1

  while (mid <= high) {
    if (nums[mid] === 0) {
      ;[nums[low], nums[mid]] = [nums[mid], nums[low]]
      low += 1
      mid += 1
    } else if (nums[mid] === 2) {
      ;[nums[mid], nums[high]] = [nums[high], nums[mid]]
      high -= 1
    } else {
      mid += 1
    }
  }
}`,
    python: `def sort_colors(nums):
    low, mid, high = 0, 0, len(nums) - 1

    while mid <= high:
        if nums[mid] == 0:
            nums[low], nums[mid] = nums[mid], nums[low]
            low += 1
            mid += 1
        elif nums[mid] == 2:
            nums[mid], nums[high] = nums[high], nums[mid]
            high -= 1
        else:
            mid += 1`,
    java: `class Solution {
    public void sortColors(int[] nums) {
        int low = 0, mid = 0, high = nums.length - 1;
        while (mid <= high) {
            if (nums[mid] == 0) {
                int temp = nums[low];
                nums[low] = nums[mid];
                nums[mid] = temp;
                low++;
                mid++;
            } else if (nums[mid] == 2) {
                int temp = nums[mid];
                nums[mid] = nums[high];
                nums[high] = temp;
                high--;
            } else {
                mid++;
            }
        }
    }
}`,
    cpp: `class Solution {
public:
    void sortColors(vector<int>& nums) {
        int low = 0, mid = 0, high = nums.size() - 1;
        while (mid <= high) {
            if (nums[mid] == 0) {
                swap(nums[low], nums[mid]);
                low++;
                mid++;
            } else if (nums[mid] == 2) {
                swap(nums[mid], nums[high]);
                high--;
            } else {
                mid++;
            }
        }
    }
};`
  },
  'Monotonic Stack': {
    javascript: `function nextGreater(arr) {
  const stack = []
  const result = new Array(arr.length).fill(-1)

  for (let i = 0; i < arr.length; i++) {
    while (stack.length && stack[stack.length - 1] < arr[i]) {
      stack.pop()
    }
    if (stack.length) result[i] = stack[stack.length - 1]
    stack.push(arr[i])
  }

  return result
}`,
    python: `def next_greater(arr):
    stack = []
    result = [-1] * len(arr)

    for i, value in enumerate(arr):
        while stack and stack[-1] < value:
            stack.pop()
        if stack:
            result[i] = stack[-1]
        stack.append(value)

    return result`,
    java: `class Solution {
    public int[] nextGreater(int[] arr) {
        int[] result = new int[arr.length];
        Stack<Integer> stack = new Stack<>();
        for (int i = 0; i < arr.length; i++) {
            while (!stack.isEmpty() && stack.peek() < arr[i]) stack.pop();
            result[i] = stack.isEmpty() ? -1 : stack.peek();
            stack.push(arr[i]);
        }
        return result;
    }
}`,
    cpp: `class Solution {
public:
    vector<int> nextGreater(vector<int>& arr) {
        vector<int> result(arr.size(), -1);
        vector<int> stack;
        for (int i = 0; i < arr.size(); i++) {
            while (!stack.empty() && stack.back() < arr[i]) stack.pop_back();
            if (!stack.empty()) result[i] = stack.back();
            stack.push_back(arr[i]);
        }
        return result;
    }
};`
  }
}

const patternCodeSnippets = {
  HashSet: {
    Java: [
      { code: 'Set<Integer> seen = new HashSet<>();', step: 0 },
      { code: 'for (int value : arr) {', step: 1 },
      { code: '  if (seen.contains(value)) return true;', step: 2 },
      { code: '  seen.add(value);', step: 3 },
      { code: '}', step: 4 }
    ],
    Python: [
      { code: 'seen = set()', step: 0 },
      { code: 'for value in arr:', step: 1 },
      { code: '    if value in seen:', step: 2 },
      { code: '        return True', step: 3 },
      { code: '    seen.add(value)', step: 4 }
    ],
    JavaScript: [
      { code: 'const seen = new Set()', step: 0 },
      { code: 'for (const value of arr) {', step: 1 },
      { code: '  if (seen.has(value)) return true', step: 2 },
      { code: '  seen.add(value)', step: 3 },
      { code: '}', step: 4 }
    ],
    'C++': [
      { code: 'unordered_set<int> seen;', step: 0 },
      { code: 'for (int value : arr) {', step: 1 },
      { code: '  if (seen.count(value)) return true;', step: 2 },
      { code: '  seen.insert(value);', step: 3 },
      { code: '}', step: 4 }
    ]
  },
  HashMap: {
    Java: [
      { code: 'Map<Integer, Integer> seen = new HashMap<>();', step: 0 },
      { code: 'for (int i = 0; i < arr.length; i++) {', step: 1 },
      { code: '  int complement = target - arr[i];', step: 2 },
      { code: '  if (seen.containsKey(complement)) return true;', step: 3 },
      { code: '  seen.put(arr[i], i);', step: 4 }
    ],
    Python: [
      { code: 'seen = {}', step: 0 },
      { code: 'for index, value in enumerate(arr):', step: 1 },
      { code: '    complement = target - value', step: 2 },
      { code: '    if complement in seen:', step: 3 },
      { code: '        return [seen[complement], index]', step: 4 }
    ],
    JavaScript: [
      { code: 'const seen = new Map()', step: 0 },
      { code: 'for (let i = 0; i < arr.length; i++) {', step: 1 },
      { code: '  const complement = target - arr[i]', step: 2 },
      { code: '  if (seen.has(complement)) return true', step: 3 },
      { code: '  seen.set(arr[i], i)', step: 4 }
    ],
    'C++': [
      { code: 'unordered_map<int, int> seen;', step: 0 },
      { code: 'for (int i = 0; i < arr.size(); i++) {', step: 1 },
      { code: '  int complement = target - arr[i];', step: 2 },
      { code: '  if (seen.count(complement)) return true;', step: 3 },
      { code: '  seen[arr[i]] = i;', step: 4 }
    ]
  },
  'Two Pointers': {
    Java: [
      { code: 'int left = 0;', step: 0 },
      { code: 'int right = arr.length - 1;', step: 0 },
      { code: 'while (left < right) {', step: 1 },
      { code: '  int sum = arr[left] + arr[right];', step: 2 },
      { code: '  if (sum < target) left++;', step: 3 },
      { code: '  else if (sum > target) right--;', step: 4 }
    ],
    Python: [
      { code: 'left, right = 0, len(arr) - 1', step: 0 },
      { code: 'while left < right:', step: 1 },
      { code: '    total = arr[left] + arr[right]', step: 2 },
      { code: '    if total < target: left += 1', step: 3 },
      { code: '    elif total > target: right -= 1', step: 4 }
    ],
    JavaScript: [
      { code: 'let left = 0', step: 0 },
      { code: 'let right = arr.length - 1', step: 0 },
      { code: 'while (left < right) {', step: 1 },
      { code: '  const total = arr[left] + arr[right]', step: 2 },
      { code: '  if (total < target) left += 1', step: 3 },
      { code: '  else if (total > target) right -= 1', step: 4 }
    ],
    'C++': [
      { code: 'int left = 0;', step: 0 },
      { code: 'int right = arr.size() - 1;', step: 0 },
      { code: 'while (left < right) {', step: 1 },
      { code: '  int total = arr[left] + arr[right];', step: 2 },
      { code: '  if (total < target) left++;', step: 3 },
      { code: '  else if (total > target) right--;', step: 4 }
    ]
  },
  'Sliding Window': {
    Java: [
      { code: 'int windowSum = 0;', step: 0 },
      { code: 'for (int i = 0; i < k; i++) windowSum += arr[i];', step: 1 },
      { code: 'for (int i = k; i < arr.length; i++) {', step: 2 },
      { code: '  windowSum += arr[i] - arr[i - k];', step: 3 },
      { code: '}', step: 4 }
    ],
    Python: [
      { code: 'window_sum = sum(arr[:k])', step: 0 },
      { code: 'for i in range(k, len(arr)):', step: 1 },
      { code: '    window_sum += arr[i] - arr[i - k]', step: 2 },
      { code: '    best = max(best, window_sum)', step: 3 }
    ],
    JavaScript: [
      { code: 'let windowSum = arr.slice(0, k).reduce((a, b) => a + b, 0)', step: 0 },
      { code: 'for (let i = k; i < arr.length; i++) {', step: 1 },
      { code: '  windowSum += arr[i] - arr[i - k]', step: 2 },
      { code: '}', step: 3 }
    ],
    'C++': [
      { code: 'int windowSum = 0;', step: 0 },
      { code: 'for (int i = 0; i < k; i++) windowSum += arr[i];', step: 1 },
      { code: 'for (int i = k; i < arr.size(); i++) {', step: 2 },
      { code: '  windowSum += arr[i] - arr[i - k];', step: 3 },
      { code: '}', step: 4 }
    ]
  },
  'Prefix Sum': {
    Java: [
      { code: 'int prefix = 0;', step: 0 },
      { code: 'for (int value : arr) {', step: 1 },
      { code: '  prefix += value;', step: 2 },
      { code: '  prefixSums.add(prefix);', step: 3 }
    ],
    Python: [
      { code: 'prefix = 0', step: 0 },
      { code: 'for value in arr:', step: 1 },
      { code: '    prefix += value', step: 2 },
      { code: '    prefix_sums.append(prefix)', step: 3 }
    ],
    JavaScript: [
      { code: 'let prefix = 0', step: 0 },
      { code: 'for (const value of arr) {', step: 1 },
      { code: '  prefix += value', step: 2 },
      { code: '  prefixSums.push(prefix)', step: 3 }
    ],
    'C++': [
      { code: 'int prefix = 0;', step: 0 },
      { code: 'for (int value : arr) {', step: 1 },
      { code: '  prefix += value;', step: 2 },
      { code: '  prefixSums.push_back(prefix);', step: 3 }
    ]
  },
  "Kadane's Algorithm": {
    Java: [
      { code: 'int current = arr[0];', step: 0 },
      { code: 'int best = arr[0];', step: 1 },
      { code: 'for (int i = 1; i < arr.length; i++) {', step: 2 },
      { code: '  current = Math.max(arr[i], current + arr[i]);', step: 3 },
      { code: '  best = Math.max(best, current);', step: 4 }
    ],
    Python: [
      { code: 'current = arr[0]', step: 0 },
      { code: 'best = arr[0]', step: 1 },
      { code: 'for i in range(1, len(arr)):', step: 2 },
      { code: '    current = max(arr[i], current + arr[i])', step: 3 },
      { code: '    best = max(best, current)', step: 4 }
    ],
    JavaScript: [
      { code: 'let current = arr[0]', step: 0 },
      { code: 'let best = arr[0]', step: 1 },
      { code: 'for (let i = 1; i < arr.length; i++) {', step: 2 },
      { code: '  current = Math.max(arr[i], current + arr[i])', step: 3 },
      { code: '  best = Math.max(best, current)', step: 4 }
    ],
    'C++': [
      { code: 'int current = arr[0];', step: 0 },
      { code: 'int best = arr[0];', step: 1 },
      { code: 'for (int i = 1; i < arr.size(); i++) {', step: 2 },
      { code: '  current = max(arr[i], current + arr[i]);', step: 3 },
      { code: '  best = max(best, current);', step: 4 }
    ]
  },
  'Dutch Flag': {
    Java: [
      { code: 'int low = 0, mid = 0, high = nums.length - 1;', step: 0 },
      { code: 'while (mid <= high) {', step: 1 },
      { code: '  if (nums[mid] == 0) swap(nums[low], nums[mid]);', step: 2 },
      { code: '  else if (nums[mid] == 2) swap(nums[mid], nums[high]);', step: 3 },
      { code: '  else mid++;', step: 4 }
    ],
    Python: [
      { code: 'low, mid, high = 0, 0, len(nums) - 1', step: 0 },
      { code: 'while mid <= high:', step: 1 },
      { code: '    if nums[mid] == 0:', step: 2 },
      { code: '    elif nums[mid] == 2:', step: 3 },
      { code: '    else:', step: 4 }
    ],
    JavaScript: [
      { code: 'let low = 0, mid = 0, high = nums.length - 1', step: 0 },
      { code: 'while (mid <= high) {', step: 1 },
      { code: '  if (nums[mid] === 0) swap(nums, low, mid)', step: 2 },
      { code: '  else if (nums[mid] === 2) swap(nums, mid, high)', step: 3 },
      { code: '  else mid += 1', step: 4 }
    ],
    'C++': [
      { code: 'int low = 0, mid = 0, high = nums.size() - 1;', step: 0 },
      { code: 'while (mid <= high) {', step: 1 },
      { code: '  if (nums[mid] == 0) swap(nums[low], nums[mid]);', step: 2 },
      { code: '  else if (nums[mid] == 2) swap(nums[mid], nums[high]);', step: 3 },
      { code: '  else mid++;', step: 4 }
    ]
  },
  'Monotonic Stack': {
    Java: [
      { code: 'Stack<Integer> stack = new Stack<>();', step: 0 },
      { code: 'for (int value : arr) {', step: 1 },
      { code: '  while (!stack.isEmpty() && stack.peek() < value) stack.pop();', step: 2 },
      { code: '  if (!stack.isEmpty()) answer[i] = stack.peek();', step: 3 },
      { code: '  stack.push(value);', step: 4 }
    ],
    Python: [
      { code: 'stack = []', step: 0 },
      { code: 'for value in arr:', step: 1 },
      { code: '    while stack and stack[-1] < value:', step: 2 },
      { code: '        stack.pop()', step: 3 },
      { code: '    stack.append(value)', step: 4 }
    ],
    JavaScript: [
      { code: 'const stack = []', step: 0 },
      { code: 'for (const value of arr) {', step: 1 },
      { code: '  while (stack.length && stack[stack.length - 1] < value) stack.pop()', step: 2 },
      { code: '  if (stack.length) result.push(stack[stack.length - 1])', step: 3 },
      { code: '  stack.push(value)', step: 4 }
    ],
    'C++': [
      { code: 'vector<int> stack;', step: 0 },
      { code: 'for (int value : arr) {', step: 1 },
      { code: '  while (!stack.empty() && stack.back() < value) stack.pop_back();', step: 2 },
      { code: '  if (!stack.empty()) result[i] = stack.back();', step: 3 },
      { code: '  stack.push_back(value);', step: 4 }
    ]
  }
}

const problems = arrayProblems

function TopicPage() {
  const [activePattern, setActivePattern] = useState('Sliding Window')
  const [activeLanguage, setActiveLanguage] = useState('Java')
  const [editorLanguage, setEditorLanguage] = useState('javascript')
  const [editorCode, setEditorCode] = useState(starterTemplates['Sliding Window'].javascript)
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [arrayInput, setArrayInput] = useState('3,1,5,2,6,4')
  const [windowInput, setWindowInput] = useState('3')

  const parsedValues = useMemo(() => {
    const numbers = arrayInput
      .split(',')
      .map((value) => Number.parseInt(value.trim(), 10))
      .filter((value) => Number.isFinite(value))

    return numbers.length > 0 ? numbers : [3, 1, 5, 2, 6, 4]
  }, [arrayInput])

  const windowSize = useMemo(() => {
    const size = Number.parseInt(windowInput, 10)
    if (!Number.isFinite(size) || size < 1) return 3
    return Math.min(Math.max(size, 1), parsedValues.length)
  }, [parsedValues, windowInput])

  const visualSteps = useMemo(() => {
    switch (activePattern) {
      case 'HashSet': {
        const values = [2, 3, 4, 2, 5]
        const seen = []
        const steps = []

        values.forEach((value) => {
          const exists = seen.includes(value)
          if (!exists) seen.push(value)
          steps.push({
            value,
            exists,
            seen: [...seen],
            narration: exists
              ? `${value} is already in the set, so this is a duplicate.`
              : `${value} is new, so we insert it into the set.`
          })
        })

        return steps
      }
      case 'HashMap': {
        const values = [2, 7, 11, 15]
        const target = 9
        const seen = []
        const steps = []

        values.forEach((value) => {
          const complement = target - value
          const found = seen.some((entry) => entry[0] === complement)
          if (!found) seen.push([value, value])
          steps.push({
            value,
            complement,
            found,
            entries: [...seen],
            narration: found
              ? `We found ${complement} in the map, so this pair works.`
              : `We store ${value} in the map and continue looking for its complement.`
          })
        })

        return steps
      }
      case 'Two Pointers': {
        const values = [1, 2, 3, 4, 5, 6]
        const target = 10
        const steps = []
        let left = 0
        let right = values.length - 1

        while (left < right) {
          const total = values[left] + values[right]
          if (total < target) {
            steps.push({
              left,
              right,
              total,
              action: 'too-small',
              narration: `${values[left]} + ${values[right]} = ${total}, which is too small, so we move left forward.`
            })
            left += 1
          } else if (total > target) {
            steps.push({
              left,
              right,
              total,
              action: 'too-big',
              narration: `${values[left]} + ${values[right]} = ${total}, which is too big, so we move right backward.`
            })
            right -= 1
          } else {
            steps.push({
              left,
              right,
              total,
              action: 'found',
              narration: `${values[left]} + ${values[right]} = ${target}. We found the pair!`
            })
            break
          }
        }

        return steps
      }
      case 'Sliding Window': {
        if (parsedValues.length === 0 || windowSize > parsedValues.length) {
          return []
        }

        const steps = []
        let windowSum = parsedValues.slice(0, windowSize).reduce((sum, value) => sum + value, 0)
        steps.push({
          start: 0,
          end: windowSize - 1,
          windowSum,
          reason: `We start with the first ${windowSize} values so the window is full.`
        })

        for (let start = 1; start <= parsedValues.length - windowSize; start += 1) {
          const leaving = parsedValues[start - 1]
          const entering = parsedValues[start + windowSize - 1]
          windowSum += entering - leaving
          steps.push({
            start,
            end: start + windowSize - 1,
            windowSum,
            reason: `The window moved right because ${leaving} left the window and ${entering} entered it.`
          })
        }

        return steps
      }
      case 'Prefix Sum': {
        const values = [2, 4, 6, 8, 10]
        const prefixSums = [0]
        const steps = []

        values.forEach((value, index) => {
          prefixSums.push(prefixSums[prefixSums.length - 1] + value)
          steps.push({
            prefixSums: [...prefixSums],
            index,
            value,
            narration: `Prefix sum after index ${index} is ${prefixSums[prefixSums.length - 1]}.`
          })
        })

        steps.push({
          prefixSums: [...prefixSums],
          query: { left: 1, right: 3 },
          narration: 'Now the range sum is prefix[right + 1] - prefix[left], which is fast to compute.'
        })

        return steps
      }
      case "Kadane's Algorithm": {
        const values = [-2, 1, -3, 4, -1, 2, 1, -5, 4]
        const steps = []
        let current = values[0]
        let best = values[0]

        steps.push({
          index: 0,
          value: values[0],
          current,
          best,
          narration: 'We start with the first value as both the current and best sum.'
        })

        values.slice(1).forEach((value, index) => {
          current = Math.max(value, current + value)
          best = Math.max(best, current)
          steps.push({
            index: index + 1,
            value,
            current,
            best,
            narration: `At this index, the running sum becomes ${current} and the best so far is ${best}.`
          })
        })

        return steps
      }
      case 'Dutch Flag': {
        const values = [2, 0, 2, 1, 1, 0]
        const steps = []
        const state = [...values]
        let low = 0
        let mid = 0
        let high = state.length - 1

        while (mid <= high) {
          if (state[mid] === 0) {
            ;[state[low], state[mid]] = [state[mid], state[low]]
            low += 1
            mid += 1
          } else if (state[mid] === 2) {
            ;[state[mid], state[high]] = [state[high], state[mid]]
            high -= 1
          } else {
            mid += 1
          }

          steps.push({
            state: [...state],
            low,
            mid,
            high,
            narration: 'The array is being partitioned into red, white, and blue regions.'
          })
        }

        return steps
      }
      case 'Monotonic Stack': {
        const values = [73, 74, 75, 71, 69, 72, 76, 73]
        const stack = []
        const steps = []

        values.forEach((value) => {
          while (stack.length && stack[stack.length - 1] < value) {
            stack.pop()
          }

          steps.push({
            value,
            stack: [...stack],
            narration: stack.length
              ? `The stack keeps the previous larger values, so ${value} sees ${stack[stack.length - 1]} as the next greater candidate.`
              : `There is no larger value on the stack, so ${value} becomes a new anchor.`
          })

          stack.push(value)
        })

        return steps
      }
      default:
        return []
    }
  }, [activePattern, parsedValues, windowSize])

  const stepCount = visualSteps.length || 1
  const currentVisualStep = visualSteps[Math.min(currentStep, visualSteps.length - 1)] || visualSteps[0]
  const activeNarration = currentVisualStep?.narration || 'Choose a pattern to start exploring.'

  useEffect(() => {
    setCurrentStep(0)
    setIsPlaying(false)
    setActiveLanguage('Java')
    setEditorLanguage('javascript')
    setEditorCode(starterTemplates[activePattern].javascript)
  }, [activePattern])

  useEffect(() => {
    if (!isPlaying) return undefined

    const intervalMs = Math.max(250, Math.round(900 / playbackSpeed))
    const interval = window.setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= stepCount - 1) {
          setIsPlaying(false)
          return prev
        }
        return prev + 1
      })
    }, intervalMs)

    return () => window.clearInterval(interval)
  }, [isPlaying, playbackSpeed, stepCount])

  const stepForward = () => {
    setCurrentStep((prev) => Math.min(prev + 1, stepCount - 1))
  }

  const stepBackward = () => {
    setIsPlaying(false)
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false)
      return
    }
    setIsPlaying(true)
  }

  const reset = () => {
    setIsPlaying(false)
    setCurrentStep(0)
  }

  const handleEditorLanguageChange = (language) => {
    const nextLanguage = language === 'cpp' ? 'cpp' : language
    setEditorLanguage(nextLanguage)
    setEditorCode(starterTemplates[activePattern][nextLanguage] || starterTemplates[activePattern].javascript)
  }

  const practiceProblems = arrayProblems.filter((problem) => problem.pattern === activePattern)

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8">
        <div className="mb-10">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-violet-400">Arrays roadmap</p>
          <h1 className="mb-2 text-4xl font-black text-white">Arrays</h1>
          <p className="max-w-3xl text-lg text-gray-400">Explore the most useful array patterns one by one, from fundamentals like HashSet to advanced stack techniques.</p>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          <aside className="lg:w-72">
            <div className="rounded-3xl border border-gray-800 bg-gray-900 p-4">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">Patterns</h2>
              <div className="flex flex-col gap-2">
                {patternOptions.map((pattern) => (
                  <button
                    key={pattern}
                    onClick={() => setActivePattern(pattern)}
                    className={`rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                      activePattern === pattern
                        ? 'bg-violet-600 text-white shadow-[0_0_20px_rgba(139,92,246,0.25)]'
                        : 'bg-gray-950/70 text-gray-300 hover:bg-gray-800'
                    }`}
                  >
                    {pattern}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <main className="flex-1 space-y-8">
            <section className="rounded-3xl border border-gray-800 bg-gray-900 p-6">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">What is this pattern?</p>
                  <h2 className="text-2xl font-black text-white">{activePattern}</h2>
                </div>
                <span className="rounded-full border border-violet-500/30 bg-violet-600/10 px-3 py-1 text-sm font-semibold text-violet-300">
                  {patternMeta[activePattern].complexity}
                </span>
              </div>
              <div className="rounded-2xl border border-gray-800 bg-gray-950/70 p-5">
                <p className="mb-3 text-base leading-relaxed text-gray-200">{patternMeta[activePattern].description}</p>
                <div className="flex flex-wrap gap-3 text-sm text-gray-400">
                  <span className="rounded-full bg-gray-800 px-3 py-1">When to use: {patternMeta[activePattern].whenToUse}</span>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-gray-800 bg-gray-900 p-6">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="mb-1 text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">Watch it work</p>
                  <h2 className="text-2xl font-black text-white">Visualizer</h2>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button onClick={reset} className="rounded-xl bg-gray-800 px-3 py-2 text-sm font-semibold text-white hover:bg-gray-700">Reset</button>
                  <button onClick={stepBackward} className="rounded-xl bg-gray-800 px-3 py-2 text-sm font-semibold text-white hover:bg-gray-700">Prev</button>
                  <button onClick={stepForward} className="rounded-xl bg-violet-600 px-3 py-2 text-sm font-semibold text-white hover:bg-violet-500">Step</button>
                  <button onClick={togglePlay} className="rounded-xl bg-gray-800 px-3 py-2 text-sm font-semibold text-white hover:bg-gray-700">{isPlaying ? 'Pause' : 'Play'}</button>
                  <label className="flex items-center gap-2 rounded-xl border border-gray-800 bg-gray-950/70 px-3 py-2 text-sm text-gray-300">
                    <span className="text-xs uppercase tracking-[0.2em] text-gray-500">Speed</span>
                    <input
                      type="range"
                      min="0.5"
                      max="2.5"
                      step="0.1"
                      value={playbackSpeed}
                      onChange={(event) => setPlaybackSpeed(Number(event.target.value))}
                      className="h-2 w-20 cursor-pointer appearance-none rounded-full bg-gray-800 accent-violet-500"
                    />
                    <span className="min-w-10 text-right text-xs font-semibold text-violet-300">{playbackSpeed.toFixed(1)}x</span>
                  </label>
                </div>
              </div>

              <div className="mb-4 rounded-2xl border-l-4 border-violet-500 bg-gray-950/70 px-4 py-3 text-sm text-gray-200">
                {activeNarration}
              </div>

              <div className="rounded-2xl border border-gray-800 bg-gray-950/70 p-5">
                {activePattern === 'HashSet' && (
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                      {parsedValues.slice(0, 5).map((value, index) => (
                        <div key={`${value}-${index}`} className="rounded-xl border border-gray-700 bg-gray-900 px-3 py-2 text-sm font-semibold text-white">
                          {value}
                        </div>
                      ))}
                    </div>
                    <div className="rounded-2xl border border-gray-800 bg-gray-900 p-4">
                      <p className="mb-2 text-xs uppercase tracking-[0.2em] text-gray-500">Current set</p>
                      <div className="flex flex-wrap gap-2">
                        {(currentVisualStep?.seen || []).map((value, index) => (
                          <span key={`${value}-${index}`} className="rounded-full bg-violet-600/20 px-3 py-1 text-sm font-semibold text-violet-300">
                            {value}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activePattern === 'HashMap' && (
                  <div className="space-y-4">
                    <div className="rounded-2xl border border-gray-800 bg-gray-900 p-4">
                      <p className="mb-2 text-xs uppercase tracking-[0.2em] text-gray-500">Stored pairs</p>
                      <div className="flex flex-wrap gap-2">
                        {(currentVisualStep?.entries || []).map(([key, value], index) => (
                          <span key={`${key}-${index}`} className="rounded-full bg-violet-600/20 px-3 py-1 text-sm font-semibold text-violet-300">
                            {key}: {value}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-2xl border border-gray-800 bg-gray-900 p-4 text-sm text-gray-300">
                      Looking for complement {currentVisualStep?.complement}
                    </div>
                  </div>
                )}

                {activePattern === 'Two Pointers' && (
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-center gap-3">
                      {[1, 2, 3, 4, 5, 6].map((value, index) => {
                        const isLeft = index === currentVisualStep.left
                        const isRight = index === currentVisualStep.right
                        return (
                          <motion.div
                            key={`${value}-${index}`}
                            animate={{ scale: isLeft || isRight ? 1.08 : 1, backgroundColor: isLeft ? '#16a34a' : isRight ? '#dc2626' : '#111827' }}
                            transition={{ duration: 0.25 }}
                            className="flex h-12 w-12 items-center justify-center rounded-xl border border-violet-500/50 text-sm font-black text-white"
                          >
                            {value}
                          </motion.div>
                        )
                      })}
                    </div>
                    <div className="rounded-2xl border border-gray-800 bg-gray-900 p-4 text-sm text-gray-300">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-green-400">Left pointer</span>
                        <span className="text-red-400">Right pointer</span>
                      </div>
                      <p>{currentVisualStep.action === 'too-small' ? 'The sum is too small, so move the left pointer right.' : currentVisualStep.action === 'too-big' ? 'The sum is too big, so move the right pointer left.' : 'The two pointers have matched the target.'}</p>
                    </div>
                  </div>
                )}

                {activePattern === 'Sliding Window' && (
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-center gap-3">
                      {parsedValues.map((value, index) => {
                        const isInside = index >= currentVisualStep.start && index <= currentVisualStep.end
                        return (
                          <motion.div
                            key={`${value}-${index}`}
                            animate={{ scale: isInside ? 1.06 : 1, backgroundColor: isInside ? '#7c3aed' : '#111827' }}
                            transition={{ duration: 0.25 }}
                            className="flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-500/30 text-sm font-black text-white"
                          >
                            {value}
                          </motion.div>
                        )
                      })}
                    </div>
                    <div className="rounded-2xl border border-violet-500/20 bg-violet-600/10 px-4 py-3 text-center text-sm font-semibold text-violet-200">
                      Current window sum: {currentVisualStep.windowSum}
                    </div>
                  </div>
                )}

                {activePattern === 'Prefix Sum' && (
                  <div className="space-y-4">
                    <div className="rounded-2xl border border-gray-800 bg-gray-900 p-4">
                      <p className="mb-2 text-xs uppercase tracking-[0.2em] text-gray-500">Prefix array</p>
                      <div className="flex flex-wrap gap-2">
                        {(currentVisualStep?.prefixSums || []).map((value, index) => (
                          <span key={`${value}-${index}`} className="rounded-full bg-violet-600/20 px-3 py-1 text-sm font-semibold text-violet-300">
                            {value}
                          </span>
                        ))}
                      </div>
                    </div>
                    {currentVisualStep?.query && (
                      <div className="rounded-2xl border border-gray-800 bg-gray-900 p-4 text-sm text-gray-300">
                        Range query from {currentVisualStep.query.left} to {currentVisualStep.query.right}
                      </div>
                    )}
                  </div>
                )}

                {activePattern === "Kadane's Algorithm" && (
                  <div className="space-y-4">
                    <div className="rounded-2xl border border-gray-800 bg-gray-900 p-4 text-sm text-gray-300">
                      Current sum: {currentVisualStep.current} • Best so far: {currentVisualStep.best}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {[-2, 1, -3, 4, -1, 2, 1, -5, 4].map((value, index) => {
                        const isActive = index === currentVisualStep.index
                        return (
                          <div key={`${value}-${index}`} className={`rounded-xl border px-3 py-2 text-sm font-semibold ${isActive ? 'border-violet-500 bg-violet-600/20 text-violet-300' : 'border-gray-700 bg-gray-900 text-white'}`}>
                            {value}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {activePattern === 'Dutch Flag' && (
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {(currentVisualStep?.state || []).map((value, index) => {
                        const color = value === 0 ? 'bg-red-500/20 text-red-300' : value === 1 ? 'bg-white/10 text-gray-100' : 'bg-blue-500/20 text-blue-300'
                        return (
                          <span key={`${value}-${index}`} className={`rounded-full px-3 py-1 text-sm font-semibold ${color}`}>
                            {value}
                          </span>
                        )
                      })}
                    </div>
                    <div className="rounded-2xl border border-gray-800 bg-gray-900 p-4 text-sm text-gray-300">
                      Low {currentVisualStep.low} • Mid {currentVisualStep.mid} • High {currentVisualStep.high}
                    </div>
                  </div>
                )}

                {activePattern === 'Monotonic Stack' && (
                  <div className="space-y-4">
                    <div className="rounded-2xl border border-gray-800 bg-gray-900 p-4">
                      <p className="mb-2 text-xs uppercase tracking-[0.2em] text-gray-500">Stack contents</p>
                      <div className="flex flex-wrap gap-2">
                        {(currentVisualStep?.stack || []).map((value, index) => (
                          <span key={`${value}-${index}`} className="rounded-full bg-violet-600/20 px-3 py-1 text-sm font-semibold text-violet-300">
                            {value}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-2xl border border-gray-800 bg-gray-900 p-4 text-sm text-gray-300">
                      Current value: {currentVisualStep.value}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-800 bg-gray-950/70 px-4 py-3 text-sm text-gray-400">
                <span>Step {Math.min(currentStep + 1, stepCount)} of {stepCount}</span>
                <span className="text-violet-400">{activePattern}</span>
              </div>
            </section>

            <section className="rounded-3xl border border-gray-800 bg-gray-900 p-6">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="mb-1 text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">Try it yourself</p>
                  <h2 className="text-2xl font-black text-white">Starter template</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['javascript', 'python', 'java', 'cpp'].map((language) => (
                    <button
                      key={language}
                      onClick={() => handleEditorLanguageChange(language)}
                      className={`rounded-full px-3 py-1 text-sm font-semibold transition ${
                        editorLanguage === language
                          ? 'bg-violet-600 text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {language === 'cpp' ? 'C++' : language.charAt(0).toUpperCase() + language.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-950">
                <Editor
                  height="320px"
                  language={editorLanguage === 'cpp' ? 'cpp' : editorLanguage}
                  value={editorCode}
                  onChange={(value) => setEditorCode(value || '')}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    scrollBeyondLastLine: false,
                    padding: { top: 12 },
                    lineNumbers: 'on',
                    roundedSelection: true
                  }}
                />
              </div>
            </section>

            <section className="rounded-3xl border border-gray-800 bg-gray-900 p-6">
              <div className="mb-5">
                <p className="mb-1 text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">Practice problems</p>
                <h2 className="text-2xl font-black text-white">{activePattern} problems</h2>
              </div>

              <div className="flex flex-col gap-4">
                {practiceProblems.map((problem) => {
                  const slug = problem.title
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)/g, '')

                  return (
                    <div key={problem.id} className="rounded-2xl border border-gray-800 bg-gray-950/70 p-5">
                      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">LeetCode {problem.id}</p>
                          <h3 className="text-lg font-bold text-white">{problem.title}</h3>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                          problem.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                          problem.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {problem.difficulty}
                        </span>
                      </div>
                      <p className="mb-4 text-sm text-gray-400">{problem.description}</p>
                      <a
                        href={`https://leetcode.com/problems/${slug}/`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex rounded-full bg-white px-3 py-2 text-sm font-semibold text-gray-950 transition hover:bg-gray-200"
                      >
                        Solve on LeetCode
                      </a>
                    </div>
                  )
                })}
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  )
}

export default TopicPage