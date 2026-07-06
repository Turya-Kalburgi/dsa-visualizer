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
  'Dutch National Flag',
  'Monotonic Stack',
  'Prefix Sum + HashMap',
  'Math / XOR',
  'Index Marking',
  'Reverse Trick',
  'Sort + Two Pointers',
  'HashMap + Bucket Sort',
  'Array Manipulation',
  'Matrix Manipulation',
  'Matrix Traversal',
  'DP',
  'Binary Search',
  "Floyd's Cycle Detection",
  'Index as Hash',
  'Two Heaps',
  'Merge Sort / BIT'
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
  'Dutch National Flag': {
    description: 'Dutch National Flag partitions the array into low, middle, and high regions in a single pass. It is the classic way to sort 0s, 1s, and 2s without extra memory.',
    whenToUse: 'Use it when the array contains a few distinct values and you want one-pass partitioning.',
    complexity: 'O(n)'
  },
  'Monotonic Stack': {
    description: 'Monotonic Stack keeps values in an order that helps answer next-greater or previous-greater questions. It is ideal for histogram and nearest-boundary problems.',
    whenToUse: 'Use it when you need to reason about the next greater element or build a structure from the left.',
    complexity: 'O(n)'
  },
  'Prefix Sum + HashMap': {
    description: 'This pairs a running prefix sum with a hashmap that counts how many times each sum has appeared. It turns "count subarrays with sum k" into a single lookup per index.',
    whenToUse: 'Use it when you need to count or find subarrays matching a sum condition in one pass.',
    complexity: 'O(n)'
  },
  'Math / XOR': {
    description: 'XOR cancels out identical values, so XOR-ing every index with every array value leaves only the one number that has no pair.',
    whenToUse: 'Use it when you need to find a single missing or unique value without extra space.',
    complexity: 'O(n) time, O(1) space'
  },
  'Index Marking': {
    description: 'Index Marking uses the array itself as a hash set by negating the value at the index a number points to. Whatever stays positive reveals a missing number.',
    whenToUse: 'Use it when values are bounded by the array length and you want O(1) extra space.',
    complexity: 'O(n) time, O(1) space'
  },
  'Reverse Trick': {
    description: 'Reverse Trick rotates an array in place by reversing the whole array, then reversing each of the two resulting pieces.',
    whenToUse: 'Use it when you need to rotate an array in place without allocating a second array.',
    complexity: 'O(n) time, O(1) space'
  },
  'Sort + Two Pointers': {
    description: 'Sorting first turns an O(n^2) search into a fixed element plus a two-pointer scan, letting you skip duplicates and prune ranges as you go.',
    whenToUse: 'Use it when you need all pairs, triplets, or quadruplets that satisfy a sum condition.',
    complexity: 'O(n^2)'
  },
  'HashMap + Bucket Sort': {
    description: 'A hashmap first counts frequencies, then values are dropped into buckets indexed by frequency so the most frequent items can be read off directly.',
    whenToUse: 'Use it when you need the top-k most (or least) frequent elements in linear time.',
    complexity: 'O(n)'
  },
  'Array Manipulation': {
    description: 'This finds the first descending pair from the right, swaps in the smallest larger value from the suffix, then reverses the suffix to get the next arrangement.',
    whenToUse: 'Use it when you need the next lexicographic permutation in place.',
    complexity: 'O(n)'
  },
  'Matrix Manipulation': {
    description: 'Transposing a matrix and then reversing each row rotates it 90 degrees clockwise without needing a second matrix.',
    whenToUse: 'Use it when you need to rotate a square matrix in place.',
    complexity: 'O(n^2)'
  },
  'Matrix Traversal': {
    description: 'Matrix Traversal walks a shrinking rectangle of top/bottom/left/right bounds, peeling one ring of the matrix off at a time.',
    whenToUse: 'Use it when you need to visit matrix cells in spiral, diagonal, or boundary order.',
    complexity: 'O(rows * cols)'
  },
  DP: {
    description: 'This dynamic programming pattern tracks both a running max and running min product at each index, since a negative value can flip the smallest product into the largest.',
    whenToUse: 'Use it when contiguous products (not sums) are involved and negative numbers can flip extremes.',
    complexity: 'O(n)'
  },
  'Binary Search': {
    description: 'Binary Search halves the search space each step by comparing the middle element to the target, and can be adapted to find the first or last matching index.',
    whenToUse: 'Use it on sorted arrays when you need a value, or a boundary, in logarithmic time.',
    complexity: 'O(log n)'
  },
  "Floyd's Cycle Detection": {
    description: "Treating array values as pointers to other indices turns a duplicate number into a cycle. Floyd's slow/fast pointers meet inside that cycle, and a second phase finds its entrance.",
    whenToUse: 'Use it when you need to find a duplicate or a cycle without extra memory.',
    complexity: 'O(n) time, O(1) space'
  },
  'Index as Hash': {
    description: 'Index as Hash places each value v at index v-1 by swapping in place, so the array itself becomes a presence table for values 1..n.',
    whenToUse: 'Use it when you need the smallest missing positive integer in O(1) extra space.',
    complexity: 'O(n) time, O(1) space'
  },
  'Two Heaps': {
    description: 'Two Heaps splits the stream into a max-heap holding the smaller half and a min-heap holding the larger half, keeping their sizes balanced so the median is always at the top.',
    whenToUse: 'Use it when you need a running median or balanced split over a data stream.',
    complexity: 'O(log n) per insert'
  },
  'Merge Sort / BIT': {
    description: 'Counting inversions during a merge-sort merge step tells you, for each element, how many later elements are smaller than it.',
    whenToUse: 'Use it when you need per-element counts of smaller (or larger) elements that appear later in the array.',
    complexity: 'O(n log n)'
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
  'Dutch National Flag': {
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
  },
  'Prefix Sum + HashMap': {
    javascript: `function subarraySum(nums, k) {
  const countBySum = new Map([[0, 1]])
  let prefix = 0
  let count = 0

  for (const value of nums) {
    prefix += value
    count += countBySum.get(prefix - k) || 0
    countBySum.set(prefix, (countBySum.get(prefix) || 0) + 1)
  }

  return count
}`,
    python: `def subarray_sum(nums, k):
    count_by_sum = {0: 1}
    prefix = 0
    count = 0

    for value in nums:
        prefix += value
        count += count_by_sum.get(prefix - k, 0)
        count_by_sum[prefix] = count_by_sum.get(prefix, 0) + 1

    return count`,
    java: `class Solution {
    public int subarraySum(int[] nums, int k) {
        Map<Integer, Integer> countBySum = new HashMap<>();
        countBySum.put(0, 1);
        int prefix = 0, count = 0;
        for (int value : nums) {
            prefix += value;
            count += countBySum.getOrDefault(prefix - k, 0);
            countBySum.put(prefix, countBySum.getOrDefault(prefix, 0) + 1);
        }
        return count;
    }
}`,
    cpp: `class Solution {
public:
    int subarraySum(vector<int>& nums, int k) {
        unordered_map<int, int> countBySum;
        countBySum[0] = 1;
        int prefix = 0, count = 0;
        for (int value : nums) {
            prefix += value;
            count += countBySum[prefix - k];
            countBySum[prefix]++;
        }
        return count;
    }
};`
  },
  'Math / XOR': {
    javascript: `function missingNumber(nums) {
  let result = nums.length

  for (let i = 0; i < nums.length; i++) {
    result ^= i ^ nums[i]
  }

  return result
}`,
    python: `def missing_number(nums):
    result = len(nums)

    for i, value in enumerate(nums):
        result ^= i ^ value

    return result`,
    java: `class Solution {
    public int missingNumber(int[] nums) {
        int result = nums.length;
        for (int i = 0; i < nums.length; i++) {
            result ^= i ^ nums[i];
        }
        return result;
    }
}`,
    cpp: `class Solution {
public:
    int missingNumber(vector<int>& nums) {
        int result = nums.size();
        for (int i = 0; i < nums.size(); i++) {
            result ^= i ^ nums[i];
        }
        return result;
    }
};`
  },
  'Index Marking': {
    javascript: `function findDisappearedNumbers(nums) {
  for (const value of nums) {
    const index = Math.abs(value) - 1
    if (nums[index] > 0) nums[index] *= -1
  }

  const missing = []
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] > 0) missing.push(i + 1)
  }

  return missing
}`,
    python: `def find_disappeared_numbers(nums):
    for value in nums:
        index = abs(value) - 1
        if nums[index] > 0:
            nums[index] *= -1

    return [i + 1 for i in range(len(nums)) if nums[i] > 0]`,
    java: `class Solution {
    public List<Integer> findDisappearedNumbers(int[] nums) {
        for (int value : nums) {
            int index = Math.abs(value) - 1;
            if (nums[index] > 0) nums[index] *= -1;
        }
        List<Integer> missing = new ArrayList<>();
        for (int i = 0; i < nums.length; i++) {
            if (nums[i] > 0) missing.add(i + 1);
        }
        return missing;
    }
}`,
    cpp: `class Solution {
public:
    vector<int> findDisappearedNumbers(vector<int>& nums) {
        for (int value : nums) {
            int index = abs(value) - 1;
            if (nums[index] > 0) nums[index] *= -1;
        }
        vector<int> missing;
        for (int i = 0; i < nums.size(); i++) {
            if (nums[i] > 0) missing.push_back(i + 1);
        }
        return missing;
    }
};`
  },
  'Reverse Trick': {
    javascript: `function rotate(nums, k) {
  const n = nums.length
  k %= n

  const reverse = (start, end) => {
    while (start < end) {
      ;[nums[start], nums[end]] = [nums[end], nums[start]]
      start += 1
      end -= 1
    }
  }

  reverse(0, n - 1)
  reverse(0, k - 1)
  reverse(k, n - 1)
}`,
    python: `def rotate(nums, k):
    n = len(nums)
    k %= n

    def reverse(start, end):
        while start < end:
            nums[start], nums[end] = nums[end], nums[start]
            start += 1
            end -= 1

    reverse(0, n - 1)
    reverse(0, k - 1)
    reverse(k, n - 1)`,
    java: `class Solution {
    public void rotate(int[] nums, int k) {
        int n = nums.length;
        k %= n;
        reverse(nums, 0, n - 1);
        reverse(nums, 0, k - 1);
        reverse(nums, k, n - 1);
    }

    private void reverse(int[] nums, int start, int end) {
        while (start < end) {
            int temp = nums[start];
            nums[start] = nums[end];
            nums[end] = temp;
            start++;
            end--;
        }
    }
}`,
    cpp: `class Solution {
public:
    void rotate(vector<int>& nums, int k) {
        int n = nums.size();
        k %= n;
        reverse(nums.begin(), nums.end());
        reverse(nums.begin(), nums.begin() + k);
        reverse(nums.begin() + k, nums.end());
    }
};`
  },
  'Sort + Two Pointers': {
    javascript: `function threeSum(nums) {
  nums.sort((a, b) => a - b)
  const result = []

  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue

    let left = i + 1
    let right = nums.length - 1

    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right]
      if (sum < 0) left += 1
      else if (sum > 0) right -= 1
      else {
        result.push([nums[i], nums[left], nums[right]])
        while (left < right && nums[left] === nums[left + 1]) left += 1
        while (left < right && nums[right] === nums[right - 1]) right -= 1
        left += 1
        right -= 1
      }
    }
  }

  return result
}`,
    python: `def three_sum(nums):
    nums.sort()
    result = []

    for i in range(len(nums) - 2):
        if i > 0 and nums[i] == nums[i - 1]:
            continue

        left, right = i + 1, len(nums) - 1
        while left < right:
            total = nums[i] + nums[left] + nums[right]
            if total < 0:
                left += 1
            elif total > 0:
                right -= 1
            else:
                result.append([nums[i], nums[left], nums[right]])
                while left < right and nums[left] == nums[left + 1]:
                    left += 1
                while left < right and nums[right] == nums[right - 1]:
                    right -= 1
                left += 1
                right -= 1

    return result`,
    java: `class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        Arrays.sort(nums);
        List<List<Integer>> result = new ArrayList<>();

        for (int i = 0; i < nums.length - 2; i++) {
            if (i > 0 && nums[i] == nums[i - 1]) continue;

            int left = i + 1, right = nums.length - 1;
            while (left < right) {
                int sum = nums[i] + nums[left] + nums[right];
                if (sum < 0) left++;
                else if (sum > 0) right--;
                else {
                    result.add(Arrays.asList(nums[i], nums[left], nums[right]));
                    while (left < right && nums[left] == nums[left + 1]) left++;
                    while (left < right && nums[right] == nums[right - 1]) right--;
                    left++;
                    right--;
                }
            }
        }

        return result;
    }
}`,
    cpp: `class Solution {
public:
    vector<vector<int>> threeSum(vector<int>& nums) {
        sort(nums.begin(), nums.end());
        vector<vector<int>> result;

        for (int i = 0; i < (int)nums.size() - 2; i++) {
            if (i > 0 && nums[i] == nums[i - 1]) continue;

            int left = i + 1, right = nums.size() - 1;
            while (left < right) {
                int sum = nums[i] + nums[left] + nums[right];
                if (sum < 0) left++;
                else if (sum > 0) right--;
                else {
                    result.push_back({nums[i], nums[left], nums[right]});
                    while (left < right && nums[left] == nums[left + 1]) left++;
                    while (left < right && nums[right] == nums[right - 1]) right--;
                    left++;
                    right--;
                }
            }
        }

        return result;
    }
};`
  },
  'HashMap + Bucket Sort': {
    javascript: `function topKFrequent(nums, k) {
  const freq = new Map()
  for (const value of nums) freq.set(value, (freq.get(value) || 0) + 1)

  const buckets = Array.from({ length: nums.length + 1 }, () => [])
  for (const [value, count] of freq) buckets[count].push(value)

  const result = []
  for (let count = buckets.length - 1; count >= 0 && result.length < k; count--) {
    for (const value of buckets[count]) {
      result.push(value)
      if (result.length === k) break
    }
  }

  return result
}`,
    python: `def top_k_frequent(nums, k):
    freq = {}
    for value in nums:
        freq[value] = freq.get(value, 0) + 1

    buckets = [[] for _ in range(len(nums) + 1)]
    for value, count in freq.items():
        buckets[count].append(value)

    result = []
    for count in range(len(buckets) - 1, -1, -1):
        for value in buckets[count]:
            result.append(value)
            if len(result) == k:
                return result

    return result`,
    java: `class Solution {
    public int[] topKFrequent(int[] nums, int k) {
        Map<Integer, Integer> freq = new HashMap<>();
        for (int value : nums) freq.merge(value, 1, Integer::sum);

        List<Integer>[] buckets = new List[nums.length + 1];
        for (Map.Entry<Integer, Integer> entry : freq.entrySet()) {
            int count = entry.getValue();
            if (buckets[count] == null) buckets[count] = new ArrayList<>();
            buckets[count].add(entry.getKey());
        }

        int[] result = new int[k];
        int index = 0;
        for (int count = buckets.length - 1; count >= 0 && index < k; count--) {
            if (buckets[count] == null) continue;
            for (int value : buckets[count]) {
                result[index++] = value;
                if (index == k) break;
            }
        }
        return result;
    }
}`,
    cpp: `class Solution {
public:
    vector<int> topKFrequent(vector<int>& nums, int k) {
        unordered_map<int, int> freq;
        for (int value : nums) freq[value]++;

        vector<vector<int>> buckets(nums.size() + 1);
        for (auto& [value, count] : freq) buckets[count].push_back(value);

        vector<int> result;
        for (int count = buckets.size() - 1; count >= 0 && (int)result.size() < k; count--) {
            for (int value : buckets[count]) {
                result.push_back(value);
                if ((int)result.size() == k) break;
            }
        }
        return result;
    }
};`
  },
  'Array Manipulation': {
    javascript: `function nextPermutation(nums) {
  let i = nums.length - 2
  while (i >= 0 && nums[i] >= nums[i + 1]) i -= 1

  if (i >= 0) {
    let j = nums.length - 1
    while (nums[j] <= nums[i]) j -= 1
    ;[nums[i], nums[j]] = [nums[j], nums[i]]
  }

  let left = i + 1
  let right = nums.length - 1
  while (left < right) {
    ;[nums[left], nums[right]] = [nums[right], nums[left]]
    left += 1
    right -= 1
  }
}`,
    python: `def next_permutation(nums):
    i = len(nums) - 2
    while i >= 0 and nums[i] >= nums[i + 1]:
        i -= 1

    if i >= 0:
        j = len(nums) - 1
        while nums[j] <= nums[i]:
            j -= 1
        nums[i], nums[j] = nums[j], nums[i]

    nums[i + 1:] = reversed(nums[i + 1:])`,
    java: `class Solution {
    public void nextPermutation(int[] nums) {
        int i = nums.length - 2;
        while (i >= 0 && nums[i] >= nums[i + 1]) i--;

        if (i >= 0) {
            int j = nums.length - 1;
            while (nums[j] <= nums[i]) j--;
            int temp = nums[i];
            nums[i] = nums[j];
            nums[j] = temp;
        }

        int left = i + 1, right = nums.length - 1;
        while (left < right) {
            int temp = nums[left];
            nums[left] = nums[right];
            nums[right] = temp;
            left++;
            right--;
        }
    }
}`,
    cpp: `class Solution {
public:
    void nextPermutation(vector<int>& nums) {
        int i = nums.size() - 2;
        while (i >= 0 && nums[i] >= nums[i + 1]) i--;

        if (i >= 0) {
            int j = nums.size() - 1;
            while (nums[j] <= nums[i]) j--;
            swap(nums[i], nums[j]);
        }

        reverse(nums.begin() + i + 1, nums.end());
    }
};`
  },
  'Matrix Manipulation': {
    javascript: `function rotate(matrix) {
  const n = matrix.length

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      ;[matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]]
    }
  }

  for (const row of matrix) row.reverse()
}`,
    python: `def rotate(matrix):
    n = len(matrix)

    for i in range(n):
        for j in range(i + 1, n):
            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]

    for row in matrix:
        row.reverse()`,
    java: `class Solution {
    public void rotate(int[][] matrix) {
        int n = matrix.length;
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                int temp = matrix[i][j];
                matrix[i][j] = matrix[j][i];
                matrix[j][i] = temp;
            }
        }
        for (int[] row : matrix) {
            for (int left = 0, right = row.length - 1; left < right; left++, right--) {
                int temp = row[left];
                row[left] = row[right];
                row[right] = temp;
            }
        }
    }
}`,
    cpp: `class Solution {
public:
    void rotate(vector<vector<int>>& matrix) {
        int n = matrix.size();
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                swap(matrix[i][j], matrix[j][i]);
            }
        }
        for (auto& row : matrix) {
            reverse(row.begin(), row.end());
        }
    }
};`
  },
  'Matrix Traversal': {
    javascript: `function spiralOrder(matrix) {
  const result = []
  let top = 0, bottom = matrix.length - 1
  let left = 0, right = matrix[0].length - 1

  while (top <= bottom && left <= right) {
    for (let col = left; col <= right; col++) result.push(matrix[top][col])
    top += 1
    for (let row = top; row <= bottom; row++) result.push(matrix[row][right])
    right -= 1
    if (top <= bottom) {
      for (let col = right; col >= left; col--) result.push(matrix[bottom][col])
      bottom -= 1
    }
    if (left <= right) {
      for (let row = bottom; row >= top; row--) result.push(matrix[row][left])
      left += 1
    }
  }

  return result
}`,
    python: `def spiral_order(matrix):
    result = []
    top, bottom = 0, len(matrix) - 1
    left, right = 0, len(matrix[0]) - 1

    while top <= bottom and left <= right:
        for col in range(left, right + 1):
            result.append(matrix[top][col])
        top += 1
        for row in range(top, bottom + 1):
            result.append(matrix[row][right])
        right -= 1
        if top <= bottom:
            for col in range(right, left - 1, -1):
                result.append(matrix[bottom][col])
            bottom -= 1
        if left <= right:
            for row in range(bottom, top - 1, -1):
                result.append(matrix[row][left])
            left += 1

    return result`,
    java: `class Solution {
    public List<Integer> spiralOrder(int[][] matrix) {
        List<Integer> result = new ArrayList<>();
        int top = 0, bottom = matrix.length - 1;
        int left = 0, right = matrix[0].length - 1;

        while (top <= bottom && left <= right) {
            for (int col = left; col <= right; col++) result.add(matrix[top][col]);
            top++;
            for (int row = top; row <= bottom; row++) result.add(matrix[row][right]);
            right--;
            if (top <= bottom) {
                for (int col = right; col >= left; col--) result.add(matrix[bottom][col]);
                bottom--;
            }
            if (left <= right) {
                for (int row = bottom; row >= top; row--) result.add(matrix[row][left]);
                left++;
            }
        }

        return result;
    }
}`,
    cpp: `class Solution {
public:
    vector<int> spiralOrder(vector<vector<int>>& matrix) {
        vector<int> result;
        int top = 0, bottom = matrix.size() - 1;
        int left = 0, right = matrix[0].size() - 1;

        while (top <= bottom && left <= right) {
            for (int col = left; col <= right; col++) result.push_back(matrix[top][col]);
            top++;
            for (int row = top; row <= bottom; row++) result.push_back(matrix[row][right]);
            right--;
            if (top <= bottom) {
                for (int col = right; col >= left; col--) result.push_back(matrix[bottom][col]);
                bottom--;
            }
            if (left <= right) {
                for (int row = bottom; row >= top; row--) result.push_back(matrix[row][left]);
                left++;
            }
        }

        return result;
    }
};`
  },
  DP: {
    javascript: `function maxProduct(nums) {
  let maxProd = nums[0]
  let minProd = nums[0]
  let best = nums[0]

  for (let i = 1; i < nums.length; i++) {
    const value = nums[i]
    if (value < 0) [maxProd, minProd] = [minProd, maxProd]

    maxProd = Math.max(value, maxProd * value)
    minProd = Math.min(value, minProd * value)
    best = Math.max(best, maxProd)
  }

  return best
}`,
    python: `def max_product(nums):
    max_prod = min_prod = best = nums[0]

    for value in nums[1:]:
        if value < 0:
            max_prod, min_prod = min_prod, max_prod

        max_prod = max(value, max_prod * value)
        min_prod = min(value, min_prod * value)
        best = max(best, max_prod)

    return best`,
    java: `class Solution {
    public int maxProduct(int[] nums) {
        int maxProd = nums[0], minProd = nums[0], best = nums[0];

        for (int i = 1; i < nums.length; i++) {
            int value = nums[i];
            if (value < 0) {
                int temp = maxProd;
                maxProd = minProd;
                minProd = temp;
            }

            maxProd = Math.max(value, maxProd * value);
            minProd = Math.min(value, minProd * value);
            best = Math.max(best, maxProd);
        }

        return best;
    }
}`,
    cpp: `class Solution {
public:
    int maxProduct(vector<int>& nums) {
        int maxProd = nums[0], minProd = nums[0], best = nums[0];

        for (int i = 1; i < (int)nums.size(); i++) {
            int value = nums[i];
            if (value < 0) swap(maxProd, minProd);

            maxProd = max(value, maxProd * value);
            minProd = min(value, minProd * value);
            best = max(best, maxProd);
        }

        return best;
    }
};`
  },
  'Binary Search': {
    javascript: `function searchRange(nums, target) {
  const findBound = (findFirst) => {
    let low = 0, high = nums.length - 1, result = -1
    while (low <= high) {
      const mid = Math.floor((low + high) / 2)
      if (nums[mid] === target) {
        result = mid
        if (findFirst) high = mid - 1
        else low = mid + 1
      } else if (nums[mid] < target) low = mid + 1
      else high = mid - 1
    }
    return result
  }

  return [findBound(true), findBound(false)]
}`,
    python: `def search_range(nums, target):
    def find_bound(find_first):
        low, high, result = 0, len(nums) - 1, -1
        while low <= high:
            mid = (low + high) // 2
            if nums[mid] == target:
                result = mid
                if find_first:
                    high = mid - 1
                else:
                    low = mid + 1
            elif nums[mid] < target:
                low = mid + 1
            else:
                high = mid - 1
        return result

    return [find_bound(True), find_bound(False)]`,
    java: `class Solution {
    public int[] searchRange(int[] nums, int target) {
        return new int[]{findBound(nums, target, true), findBound(nums, target, false)};
    }

    private int findBound(int[] nums, int target, boolean findFirst) {
        int low = 0, high = nums.length - 1, result = -1;
        while (low <= high) {
            int mid = (low + high) / 2;
            if (nums[mid] == target) {
                result = mid;
                if (findFirst) high = mid - 1;
                else low = mid + 1;
            } else if (nums[mid] < target) low = mid + 1;
            else high = mid - 1;
        }
        return result;
    }
}`,
    cpp: `class Solution {
public:
    vector<int> searchRange(vector<int>& nums, int target) {
        return {findBound(nums, target, true), findBound(nums, target, false)};
    }

private:
    int findBound(vector<int>& nums, int target, bool findFirst) {
        int low = 0, high = nums.size() - 1, result = -1;
        while (low <= high) {
            int mid = (low + high) / 2;
            if (nums[mid] == target) {
                result = mid;
                if (findFirst) high = mid - 1;
                else low = mid + 1;
            } else if (nums[mid] < target) low = mid + 1;
            else high = mid - 1;
        }
        return result;
    }
};`
  },
  "Floyd's Cycle Detection": {
    javascript: `function findDuplicate(nums) {
  let slow = nums[0]
  let fast = nums[0]

  do {
    slow = nums[slow]
    fast = nums[nums[fast]]
  } while (slow !== fast)

  slow = nums[0]
  while (slow !== fast) {
    slow = nums[slow]
    fast = nums[fast]
  }

  return slow
}`,
    python: `def find_duplicate(nums):
    slow = fast = nums[0]

    while True:
        slow = nums[slow]
        fast = nums[nums[fast]]
        if slow == fast:
            break

    slow = nums[0]
    while slow != fast:
        slow = nums[slow]
        fast = nums[fast]

    return slow`,
    java: `class Solution {
    public int findDuplicate(int[] nums) {
        int slow = nums[0], fast = nums[0];

        do {
            slow = nums[slow];
            fast = nums[nums[fast]];
        } while (slow != fast);

        slow = nums[0];
        while (slow != fast) {
            slow = nums[slow];
            fast = nums[fast];
        }

        return slow;
    }
}`,
    cpp: `class Solution {
public:
    int findDuplicate(vector<int>& nums) {
        int slow = nums[0], fast = nums[0];

        do {
            slow = nums[slow];
            fast = nums[nums[fast]];
        } while (slow != fast);

        slow = nums[0];
        while (slow != fast) {
            slow = nums[slow];
            fast = nums[fast];
        }

        return slow;
    }
};`
  },
  'Index as Hash': {
    javascript: `function firstMissingPositive(nums) {
  const n = nums.length

  for (let i = 0; i < n; i++) {
    while (nums[i] > 0 && nums[i] <= n && nums[nums[i] - 1] !== nums[i]) {
      const target = nums[i] - 1
      ;[nums[i], nums[target]] = [nums[target], nums[i]]
    }
  }

  for (let i = 0; i < n; i++) {
    if (nums[i] !== i + 1) return i + 1
  }

  return n + 1
}`,
    python: `def first_missing_positive(nums):
    n = len(nums)

    for i in range(n):
        while 0 < nums[i] <= n and nums[nums[i] - 1] != nums[i]:
            target = nums[i] - 1
            nums[i], nums[target] = nums[target], nums[i]

    for i in range(n):
        if nums[i] != i + 1:
            return i + 1

    return n + 1`,
    java: `class Solution {
    public int firstMissingPositive(int[] nums) {
        int n = nums.length;

        for (int i = 0; i < n; i++) {
            while (nums[i] > 0 && nums[i] <= n && nums[nums[i] - 1] != nums[i]) {
                int target = nums[i] - 1;
                int temp = nums[i];
                nums[i] = nums[target];
                nums[target] = temp;
            }
        }

        for (int i = 0; i < n; i++) {
            if (nums[i] != i + 1) return i + 1;
        }

        return n + 1;
    }
}`,
    cpp: `class Solution {
public:
    int firstMissingPositive(vector<int>& nums) {
        int n = nums.size();

        for (int i = 0; i < n; i++) {
            while (nums[i] > 0 && nums[i] <= n && nums[nums[i] - 1] != nums[i]) {
                swap(nums[i], nums[nums[i] - 1]);
            }
        }

        for (int i = 0; i < n; i++) {
            if (nums[i] != i + 1) return i + 1;
        }

        return n + 1;
    }
};`
  },
  'Two Heaps': {
    javascript: `class MedianFinder {
  constructor() {
    this.lower = [] // max-heap, stored descending
    this.upper = [] // min-heap, stored ascending
  }

  addNum(num) {
    this.lower.push(num)
    this.lower.sort((a, b) => b - a)

    this.upper.push(this.lower.shift())
    this.upper.sort((a, b) => a - b)

    if (this.upper.length > this.lower.length) {
      this.lower.push(this.upper.shift())
    }
  }

  findMedian() {
    if (this.lower.length > this.upper.length) return this.lower[0]
    return (this.lower[0] + this.upper[0]) / 2
  }
}`,
    python: `import heapq

class MedianFinder:
    def __init__(self):
        self.lower = []  # max-heap (negated)
        self.upper = []  # min-heap

    def add_num(self, num):
        heapq.heappush(self.lower, -num)
        heapq.heappush(self.upper, -heapq.heappop(self.lower))

        if len(self.upper) > len(self.lower):
            heapq.heappush(self.lower, -heapq.heappop(self.upper))

    def find_median(self):
        if len(self.lower) > len(self.upper):
            return -self.lower[0]
        return (-self.lower[0] + self.upper[0]) / 2`,
    java: `class MedianFinder {
    private PriorityQueue<Integer> lower = new PriorityQueue<>(Collections.reverseOrder());
    private PriorityQueue<Integer> upper = new PriorityQueue<>();

    public void addNum(int num) {
        lower.offer(num);
        upper.offer(lower.poll());
        if (upper.size() > lower.size()) {
            lower.offer(upper.poll());
        }
    }

    public double findMedian() {
        if (lower.size() > upper.size()) return lower.peek();
        return (lower.peek() + upper.peek()) / 2.0;
    }
}`,
    cpp: `class MedianFinder {
public:
    priority_queue<int> lower;
    priority_queue<int, vector<int>, greater<int>> upper;

    void addNum(int num) {
        lower.push(num);
        upper.push(lower.top());
        lower.pop();
        if (upper.size() > lower.size()) {
            lower.push(upper.top());
            upper.pop();
        }
    }

    double findMedian() {
        if (lower.size() > upper.size()) return lower.top();
        return (lower.top() + upper.top()) / 2.0;
    }
};`
  },
  'Merge Sort / BIT': {
    javascript: `function countSmaller(nums) {
  const n = nums.length
  const counts = new Array(n).fill(0)
  const indices = nums.map((_, i) => i)

  const mergeSort = (arr) => {
    if (arr.length <= 1) return arr
    const mid = Math.floor(arr.length / 2)
    const left = mergeSort(arr.slice(0, mid))
    const right = mergeSort(arr.slice(mid))

    const merged = []
    let i = 0, j = 0, rightCount = 0

    while (i < left.length && j < right.length) {
      if (nums[left[i]] > nums[right[j]]) {
        rightCount += 1
        merged.push(right[j])
        j += 1
      } else {
        counts[left[i]] += rightCount
        merged.push(left[i])
        i += 1
      }
    }

    while (i < left.length) {
      counts[left[i]] += rightCount
      merged.push(left[i])
      i += 1
    }
    while (j < right.length) merged.push(right[j++])

    return merged
  }

  mergeSort(indices)
  return counts
}`,
    python: `def count_smaller(nums):
    n = len(nums)
    counts = [0] * n

    def merge_sort(indices):
        if len(indices) <= 1:
            return indices
        mid = len(indices) // 2
        left = merge_sort(indices[:mid])
        right = merge_sort(indices[mid:])

        merged = []
        i = j = right_count = 0
        while i < len(left) and j < len(right):
            if nums[left[i]] > nums[right[j]]:
                right_count += 1
                merged.append(right[j])
                j += 1
            else:
                counts[left[i]] += right_count
                merged.append(left[i])
                i += 1

        while i < len(left):
            counts[left[i]] += right_count
            merged.append(left[i])
            i += 1
        merged.extend(right[j:])

        return merged

    merge_sort(list(range(n)))
    return counts`,
    java: `class Solution {
    private int[] nums;
    private int[] counts;

    public List<Integer> countSmaller(int[] nums) {
        this.nums = nums;
        this.counts = new int[nums.length];
        Integer[] indices = new Integer[nums.length];
        for (int i = 0; i < nums.length; i++) indices[i] = i;

        mergeSort(indices, 0, indices.length - 1);

        List<Integer> result = new ArrayList<>();
        for (int count : counts) result.add(count);
        return result;
    }

    private void mergeSort(Integer[] indices, int lo, int hi) {
        if (lo >= hi) return;
        int mid = (lo + hi) / 2;
        mergeSort(indices, lo, mid);
        mergeSort(indices, mid + 1, hi);

        Integer[] merged = new Integer[hi - lo + 1];
        int i = lo, j = mid + 1, k = 0, rightCount = 0;
        while (i <= mid && j <= hi) {
            if (nums[indices[i]] > nums[indices[j]]) {
                rightCount++;
                merged[k++] = indices[j++];
            } else {
                counts[indices[i]] += rightCount;
                merged[k++] = indices[i++];
            }
        }
        while (i <= mid) {
            counts[indices[i]] += rightCount;
            merged[k++] = indices[i++];
        }
        while (j <= hi) merged[k++] = indices[j++];

        System.arraycopy(merged, 0, indices, lo, merged.length);
    }
}`,
    cpp: `class Solution {
public:
    vector<int> countSmaller(vector<int>& nums) {
        int n = nums.size();
        vector<int> counts(n, 0), indices(n);
        for (int i = 0; i < n; i++) indices[i] = i;

        mergeSort(indices, 0, n - 1, nums, counts);
        return counts;
    }

private:
    void mergeSort(vector<int>& indices, int lo, int hi, vector<int>& nums, vector<int>& counts) {
        if (lo >= hi) return;
        int mid = (lo + hi) / 2;
        mergeSort(indices, lo, mid, nums, counts);
        mergeSort(indices, mid + 1, hi, nums, counts);

        vector<int> merged;
        int i = lo, j = mid + 1, rightCount = 0;
        while (i <= mid && j <= hi) {
            if (nums[indices[i]] > nums[indices[j]]) {
                rightCount++;
                merged.push_back(indices[j++]);
            } else {
                counts[indices[i]] += rightCount;
                merged.push_back(indices[i++]);
            }
        }
        while (i <= mid) {
            counts[indices[i]] += rightCount;
            merged.push_back(indices[i++]);
        }
        while (j <= hi) merged.push_back(indices[j++]);

        for (int k = lo; k <= hi; k++) indices[k] = merged[k - lo];
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
      case 'Dutch National Flag': {
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
      case 'Prefix Sum + HashMap': {
        const values = [3, 4, 7, 2, -3, 1, 4, 2]
        const k = 7
        const countBySum = new Map([[0, 1]])
        let prefix = 0
        let matches = 0
        const steps = []

        values.forEach((value) => {
          prefix += value
          const found = countBySum.get(prefix - k) || 0
          matches += found
          countBySum.set(prefix, (countBySum.get(prefix) || 0) + 1)

          steps.push({
            value,
            prefix,
            matches,
            found,
            entries: Array.from(countBySum.entries()),
            narration: found
              ? `Prefix sum is now ${prefix}. We have seen ${prefix - k} before ${found} time(s), so ${found} more subarray(s) sum to ${k}.`
              : `Prefix sum is now ${prefix}. We have not seen ${prefix - k} yet, so no new subarray sums to ${k}.`
          })
        })

        return steps
      }
      case 'Math / XOR': {
        const values = [3, 0, 1]
        let result = values.length
        const steps = [{
          index: -1,
          result,
          narration: `Start with result = n = ${values.length}.`
        }]

        values.forEach((value, index) => {
          result ^= index ^ value
          steps.push({
            index,
            result,
            narration: `XOR in index ${index} and value ${value}. Result becomes ${result}.`
          })
        })

        return steps
      }
      case 'Index Marking': {
        const values = [4, 3, 2, 7, 8, 2, 3, 1]
        const state = [...values]
        const steps = []

        state.forEach((value) => {
          const index = Math.abs(value) - 1
          if (state[index] > 0) state[index] *= -1
          steps.push({
            state: [...state],
            index,
            narration: `Value ${Math.abs(value)} means index ${index} is present, so we flip it negative.`
          })
        })

        const missing = []
        state.forEach((value, index) => {
          if (value > 0) missing.push(index + 1)
        })
        steps.push({
          state: [...state],
          missing,
          narration: missing.length
            ? `Indices still positive reveal the missing numbers: ${missing.join(', ')}.`
            : 'Every index got marked, so nothing is missing.'
        })

        return steps
      }
      case 'Reverse Trick': {
        const values = [1, 2, 3, 4, 5, 6, 7]
        const k = 3 % values.length
        const state = [...values]
        const steps = []

        const reverseRange = (start, end) => {
          while (start < end) {
            ;[state[start], state[end]] = [state[end], state[start]]
            start += 1
            end -= 1
          }
        }

        reverseRange(0, state.length - 1)
        steps.push({ state: [...state], narration: 'Reverse the entire array first.' })

        reverseRange(0, k - 1)
        steps.push({ state: [...state], narration: `Reverse the first ${k} values back into rotated order.` })

        reverseRange(k, state.length - 1)
        steps.push({ state: [...state], narration: `Reverse the remaining values. The array is now rotated right by ${k}.` })

        return steps
      }
      case 'Sort + Two Pointers': {
        const sorted = [-4, -1, -1, 0, 1, 2]
        const steps = []
        const triplets = []

        for (let i = 0; i < sorted.length - 2; i += 1) {
          if (i > 0 && sorted[i] === sorted[i - 1]) continue

          let left = i + 1
          let right = sorted.length - 1

          while (left < right) {
            const sum = sorted[i] + sorted[left] + sorted[right]
            if (sum < 0) {
              steps.push({ i, left, right, sum, action: 'too-small', triplets: [...triplets], narration: `${sorted[i]} + ${sorted[left]} + ${sorted[right]} = ${sum}, too small, move left forward.` })
              left += 1
            } else if (sum > 0) {
              steps.push({ i, left, right, sum, action: 'too-big', triplets: [...triplets], narration: `${sorted[i]} + ${sorted[left]} + ${sorted[right]} = ${sum}, too big, move right backward.` })
              right -= 1
            } else {
              triplets.push([sorted[i], sorted[left], sorted[right]])
              steps.push({ i, left, right, sum, action: 'found', triplets: [...triplets], narration: `${sorted[i]} + ${sorted[left]} + ${sorted[right]} = 0. Triplet found!` })
              left += 1
              right -= 1
              while (left < right && sorted[left] === sorted[left - 1]) left += 1
            }
          }
        }

        return steps
      }
      case 'HashMap + Bucket Sort': {
        const values = [1, 1, 1, 2, 2, 3]
        const k = 2
        const freq = new Map()
        values.forEach((value) => freq.set(value, (freq.get(value) || 0) + 1))

        const buckets = Array.from({ length: values.length + 1 }, () => [])
        freq.forEach((count, value) => buckets[count].push(value))

        const steps = [{
          phase: 'count',
          entries: Array.from(freq.entries()),
          narration: 'First we count how many times each value appears.'
        }]

        steps.push({
          phase: 'bucket',
          buckets: buckets.map((bucket) => [...bucket]),
          narration: 'Each value is dropped into a bucket indexed by its frequency.'
        })

        const result = []
        for (let count = buckets.length - 1; count >= 0 && result.length < k; count -= 1) {
          buckets[count].forEach((value) => {
            if (result.length < k) result.push(value)
          })
        }
        steps.push({
          phase: 'collect',
          result: [...result],
          narration: `Reading buckets from the highest frequency down gives the top ${k}: ${result.join(', ')}.`
        })

        return steps
      }
      case 'Array Manipulation': {
        const values = [1, 2, 3]
        const state = [...values]
        const steps = []

        let i = state.length - 2
        while (i >= 0 && state[i] >= state[i + 1]) i -= 1
        steps.push({ state: [...state], pivot: i, narration: i >= 0 ? `Index ${i} is the first value that is smaller than the one after it.` : 'The array is fully descending, so this is the last permutation.' })

        if (i >= 0) {
          let j = state.length - 1
          while (state[j] <= state[i]) j -= 1
          steps.push({ state: [...state], pivot: i, successor: j, narration: `Index ${j} holds the smallest value larger than the pivot.` })
          ;[state[i], state[j]] = [state[j], state[i]]
          steps.push({ state: [...state], pivot: i, successor: j, narration: 'Swap the pivot with its successor.' })
        }

        let left = i + 1
        let right = state.length - 1
        while (left < right) {
          ;[state[left], state[right]] = [state[right], state[left]]
          left += 1
          right -= 1
        }
        steps.push({ state: [...state], narration: 'Reverse everything after the pivot to get the next permutation.' })

        return steps
      }
      case 'Matrix Manipulation': {
        const matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
        const steps = [{ matrix: matrix.map((row) => [...row]), narration: 'Start with the original matrix.' }]

        const transposed = matrix.map((row, i) => row.map((_, j) => matrix[j][i]))
        steps.push({ matrix: transposed.map((row) => [...row]), narration: 'Transpose the matrix by flipping it over its diagonal.' })

        const rotated = transposed.map((row) => [...row].reverse())
        steps.push({ matrix: rotated.map((row) => [...row]), narration: 'Reverse every row to complete the 90 degree rotation.' })

        return steps
      }
      case 'Matrix Traversal': {
        const matrix = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]
        const steps = []
        const visited = []
        let top = 0, bottom = matrix.length - 1
        let left = 0, right = matrix[0].length - 1

        const pushStep = (row, col) => {
          visited.push([row, col])
          steps.push({ visited: [...visited], row, col, narration: `Visit row ${row}, column ${col} (value ${matrix[row][col]}).` })
        }

        while (top <= bottom && left <= right) {
          for (let col = left; col <= right; col += 1) pushStep(top, col)
          top += 1
          for (let row = top; row <= bottom; row += 1) pushStep(row, right)
          right -= 1
          if (top <= bottom) {
            for (let col = right; col >= left; col -= 1) pushStep(bottom, col)
            bottom -= 1
          }
          if (left <= right) {
            for (let row = bottom; row >= top; row -= 1) pushStep(row, left)
            left += 1
          }
        }

        return steps.map((step) => ({ ...step, matrix }))
      }
      case 'DP': {
        const values = [2, 3, -2, 4]
        let maxProd = values[0]
        let minProd = values[0]
        let best = values[0]
        const steps = [{ index: 0, value: values[0], maxProd, minProd, best, narration: 'Start with the first value as the running max, min, and best product.' }]

        for (let index = 1; index < values.length; index += 1) {
          const value = values[index]
          if (value < 0) {
            const temp = maxProd
            maxProd = minProd
            minProd = temp
          }
          maxProd = Math.max(value, maxProd * value)
          minProd = Math.min(value, minProd * value)
          best = Math.max(best, maxProd)

          steps.push({
            index,
            value,
            maxProd,
            minProd,
            best,
            narration: value < 0
              ? `${value} is negative, so max and min swap before multiplying. Best product so far is ${best}.`
              : `Multiplying keeps the running max at ${maxProd}. Best product so far is ${best}.`
          })
        }

        return steps
      }
      case 'Binary Search': {
        const values = [5, 7, 7, 8, 8, 10]
        const target = 8
        const steps = []

        const findBound = (findFirst) => {
          let low = 0
          let high = values.length - 1
          let result = -1

          while (low <= high) {
            const mid = Math.floor((low + high) / 2)
            if (values[mid] === target) {
              result = mid
              steps.push({ low, high, mid, phase: findFirst ? 'left bound' : 'right bound', narration: `Found target at index ${mid}, keep searching ${findFirst ? 'left' : 'right'} for the boundary.` })
              if (findFirst) high = mid - 1
              else low = mid + 1
            } else if (values[mid] < target) {
              steps.push({ low, high, mid, phase: findFirst ? 'left bound' : 'right bound', narration: `${values[mid]} is less than ${target}, search the right half.` })
              low = mid + 1
            } else {
              steps.push({ low, high, mid, phase: findFirst ? 'left bound' : 'right bound', narration: `${values[mid]} is greater than ${target}, search the left half.` })
              high = mid - 1
            }
          }

          return result
        }

        const first = findBound(true)
        const last = findBound(false)
        steps.push({ low: first, high: last, mid: first, phase: 'result', narration: `Target ${target} spans indices ${first} to ${last}.` })

        return steps
      }
      case "Floyd's Cycle Detection": {
        const values = [1, 3, 4, 2, 2]
        const steps = []
        let slow = values[0]
        let fast = values[0]

        do {
          slow = values[slow]
          fast = values[values[fast]]
          steps.push({ slow, fast, phase: 'meeting', narration: `Slow moves to index ${slow}, fast jumps to index ${fast}.` })
        } while (slow !== fast)

        steps.push({ slow, fast, phase: 'meeting', narration: 'Slow and fast pointers meet inside the cycle.' })

        slow = values[0]
        while (slow !== fast) {
          slow = values[slow]
          fast = values[fast]
          steps.push({ slow, fast, phase: 'entrance', narration: `Both pointers now move one step at a time toward index ${slow}.` })
        }

        steps.push({ slow, fast, phase: 'done', narration: `Both pointers now point to ${slow} — that is the duplicate number.` })

        return steps
      }
      case 'Index as Hash': {
        const values = [3, 4, -1, 1]
        const state = [...values]
        const n = state.length
        const steps = [{ state: [...state], narration: 'Start placing each positive value v at index v - 1.' }]

        for (let i = 0; i < n; i += 1) {
          while (state[i] > 0 && state[i] <= n && state[state[i] - 1] !== state[i]) {
            const target = state[i] - 1
            ;[state[i], state[target]] = [state[target], state[i]]
            steps.push({ state: [...state], index: i, target, narration: `Swap value into index ${target} where it belongs.` })
          }
        }

        let missingIndex = n
        for (let i = 0; i < n; i += 1) {
          if (state[i] !== i + 1) {
            missingIndex = i
            break
          }
        }
        steps.push({ state: [...state], missing: missingIndex + 1, narration: `The first index that does not hold its expected value reveals the answer: ${missingIndex + 1}.` })

        return steps
      }
      case 'Two Heaps': {
        const stream = [5, 15, 1, 3, 8]
        const lower = []
        const upper = []
        const steps = []

        stream.forEach((num) => {
          lower.push(num)
          lower.sort((a, b) => b - a)
          upper.push(lower.shift())
          upper.sort((a, b) => a - b)
          if (upper.length > lower.length) {
            lower.push(upper.shift())
            lower.sort((a, b) => b - a)
          }

          const median = lower.length > upper.length ? lower[0] : (lower[0] + upper[0]) / 2
          steps.push({
            num,
            lower: [...lower],
            upper: [...upper],
            median,
            narration: `Insert ${num}, rebalance the two heaps, and the median is now ${median}.`
          })
        })

        return steps
      }
      case 'Merge Sort / BIT': {
        const values = [5, 2, 6, 1]
        const counts = new Array(values.length).fill(0)
        const steps = []

        const mergeSort = (indices) => {
          if (indices.length <= 1) return indices
          const mid = Math.floor(indices.length / 2)
          const left = mergeSort(indices.slice(0, mid))
          const right = mergeSort(indices.slice(mid))

          const merged = []
          let i = 0, j = 0, rightCount = 0

          while (i < left.length && j < right.length) {
            if (values[left[i]] > values[right[j]]) {
              rightCount += 1
              merged.push(right[j])
              j += 1
            } else {
              counts[left[i]] += rightCount
              steps.push({ counts: [...counts], index: left[i], narration: `${values[left[i]]} has ${rightCount} smaller value(s) already placed to its right.` })
              merged.push(left[i])
              i += 1
            }
          }

          while (i < left.length) {
            counts[left[i]] += rightCount
            steps.push({ counts: [...counts], index: left[i], narration: `${values[left[i]]} has ${rightCount} smaller value(s) already placed to its right.` })
            merged.push(left[i])
            i += 1
          }
          while (j < right.length) {
            merged.push(right[j])
            j += 1
          }

          return merged
        }

        mergeSort(values.map((_, index) => index))
        steps.push({ counts: [...counts], narration: `Final smaller-count for each value: ${values.map((value, index) => `${value}:${counts[index]}`).join(', ')}.` })

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
          <p className="max-w-3xl text-lg text-gray-400">Explore all 23 array patterns one by one, from fundamentals like HashSet and Two Pointers to advanced techniques like Two Heaps and Floyd's Cycle Detection.</p>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          <aside className="lg:w-72">
            <div className="rounded-3xl border border-gray-800 bg-gray-900 p-4">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">Patterns</h2>
              <div className="flex max-h-[70vh] flex-col gap-2 overflow-y-auto pr-1">
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

                {activePattern === 'Dutch National Flag' && (
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

                {activePattern === 'Prefix Sum + HashMap' && (
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-300">
                      <span className="rounded-xl border border-gray-700 bg-gray-900 px-3 py-2 font-semibold text-white">Prefix: {currentVisualStep?.prefix}</span>
                      <span className="rounded-xl border border-gray-700 bg-gray-900 px-3 py-2 font-semibold text-white">Matches so far: {currentVisualStep?.matches}</span>
                    </div>
                    <div className="rounded-2xl border border-gray-800 bg-gray-900 p-4">
                      <p className="mb-2 text-xs uppercase tracking-[0.2em] text-gray-500">Sum counts</p>
                      <div className="flex flex-wrap gap-2">
                        {(currentVisualStep?.entries || []).map(([sum, count], index) => (
                          <span key={`${sum}-${index}`} className="rounded-full bg-violet-600/20 px-3 py-1 text-sm font-semibold text-violet-300">
                            {sum}: {count}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activePattern === 'Math / XOR' && (
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                      {[3, 0, 1].map((value, index) => (
                        <div key={`${value}-${index}`} className={`flex h-12 w-12 items-center justify-center rounded-xl border text-sm font-black ${index === currentVisualStep?.index ? 'border-violet-500 bg-violet-600/20 text-violet-300' : 'border-gray-700 bg-gray-900 text-white'}`}>
                          {value}
                        </div>
                      ))}
                    </div>
                    <div className="rounded-2xl border border-violet-500/20 bg-violet-600/10 px-4 py-3 text-center text-sm font-semibold text-violet-200">
                      Running XOR result: {currentVisualStep?.result}
                    </div>
                  </div>
                )}

                {activePattern === 'Index Marking' && (
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {(currentVisualStep?.state || []).map((value, index) => (
                        <div key={`${value}-${index}`} className={`flex h-12 w-12 items-center justify-center rounded-xl border text-sm font-black ${value < 0 ? 'border-red-500/50 bg-red-500/10 text-red-300' : 'border-gray-700 bg-gray-900 text-white'}`}>
                          {value}
                        </div>
                      ))}
                    </div>
                    {currentVisualStep?.missing && (
                      <div className="rounded-2xl border border-gray-800 bg-gray-900 p-4 text-sm text-gray-300">
                        Missing numbers: {currentVisualStep.missing.join(', ')}
                      </div>
                    )}
                  </div>
                )}

                {activePattern === 'Reverse Trick' && (
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {(currentVisualStep?.state || []).map((value, index) => (
                      <motion.div
                        key={`${value}-${index}`}
                        animate={{ scale: 1 }}
                        className="flex h-12 w-12 items-center justify-center rounded-xl border border-violet-500/40 bg-gray-900 text-sm font-black text-white"
                      >
                        {value}
                      </motion.div>
                    ))}
                  </div>
                )}

                {activePattern === 'Sort + Two Pointers' && (
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      {[-4, -1, -1, 0, 1, 2].map((value, index) => {
                        const isFixed = index === currentVisualStep?.i
                        const isLeft = index === currentVisualStep?.left
                        const isRight = index === currentVisualStep?.right
                        const background = isFixed ? '#7c3aed' : isLeft ? '#16a34a' : isRight ? '#dc2626' : '#111827'
                        return (
                          <motion.div
                            key={`${value}-${index}`}
                            animate={{ scale: isFixed || isLeft || isRight ? 1.08 : 1, backgroundColor: background }}
                            transition={{ duration: 0.25 }}
                            className="flex h-12 w-12 items-center justify-center rounded-xl border border-violet-500/50 text-sm font-black text-white"
                          >
                            {value}
                          </motion.div>
                        )
                      })}
                    </div>
                    <div className="rounded-2xl border border-gray-800 bg-gray-900 p-4">
                      <p className="mb-2 text-xs uppercase tracking-[0.2em] text-gray-500">Triplets found</p>
                      <div className="flex flex-wrap gap-2">
                        {(currentVisualStep?.triplets || []).map((triplet, index) => (
                          <span key={index} className="rounded-full bg-violet-600/20 px-3 py-1 text-sm font-semibold text-violet-300">
                            [{triplet.join(', ')}]
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activePattern === 'HashMap + Bucket Sort' && (
                  <div className="space-y-4">
                    {currentVisualStep?.phase === 'count' && (
                      <div className="flex flex-wrap gap-2">
                        {(currentVisualStep.entries || []).map(([value, count], index) => (
                          <span key={`${value}-${index}`} className="rounded-full bg-violet-600/20 px-3 py-1 text-sm font-semibold text-violet-300">
                            {value} × {count}
                          </span>
                        ))}
                      </div>
                    )}
                    {currentVisualStep?.phase === 'bucket' && (
                      <div className="space-y-2">
                        {(currentVisualStep.buckets || []).map((bucket, count) => (
                          bucket.length > 0 && (
                            <div key={count} className="flex items-center gap-2 text-sm text-gray-300">
                              <span className="w-24 shrink-0 text-xs uppercase tracking-[0.2em] text-gray-500">Freq {count}</span>
                              <div className="flex flex-wrap gap-2">
                                {bucket.map((value, index) => (
                                  <span key={index} className="rounded-full bg-gray-800 px-3 py-1 font-semibold text-white">{value}</span>
                                ))}
                              </div>
                            </div>
                          )
                        ))}
                      </div>
                    )}
                    {currentVisualStep?.phase === 'collect' && (
                      <div className="rounded-2xl border border-violet-500/20 bg-violet-600/10 px-4 py-3 text-center text-sm font-semibold text-violet-200">
                        Top K result: {(currentVisualStep.result || []).join(', ')}
                      </div>
                    )}
                  </div>
                )}

                {activePattern === 'Array Manipulation' && (
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {(currentVisualStep?.state || []).map((value, index) => {
                      const isPivot = index === currentVisualStep?.pivot
                      const isSuccessor = index === currentVisualStep?.successor
                      return (
                        <div key={`${value}-${index}`} className={`flex h-12 w-12 items-center justify-center rounded-xl border text-sm font-black ${isPivot ? 'border-green-500 bg-green-500/10 text-green-300' : isSuccessor ? 'border-red-500 bg-red-500/10 text-red-300' : 'border-gray-700 bg-gray-900 text-white'}`}>
                          {value}
                        </div>
                      )
                    })}
                  </div>
                )}

                {activePattern === 'Matrix Manipulation' && (
                  <div className="flex justify-center">
                    <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${(currentVisualStep?.matrix?.[0] || []).length}, minmax(0, 1fr))` }}>
                      {(currentVisualStep?.matrix || []).flatMap((row, rowIndex) =>
                        row.map((value, colIndex) => (
                          <div key={`${rowIndex}-${colIndex}`} className="flex h-12 w-12 items-center justify-center rounded-lg border border-gray-700 bg-gray-900 text-sm font-black text-white">
                            {value}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {activePattern === 'Matrix Traversal' && (
                  <div className="flex justify-center">
                    <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${(currentVisualStep?.matrix?.[0] || []).length}, minmax(0, 1fr))` }}>
                      {(currentVisualStep?.matrix || []).flatMap((row, rowIndex) =>
                        row.map((value, colIndex) => {
                          const isVisited = (currentVisualStep?.visited || []).some(([r, c]) => r === rowIndex && c === colIndex)
                          const isCurrent = rowIndex === currentVisualStep?.row && colIndex === currentVisualStep?.col
                          return (
                            <div key={`${rowIndex}-${colIndex}`} className={`flex h-12 w-12 items-center justify-center rounded-lg border text-sm font-black ${isCurrent ? 'border-violet-500 bg-violet-600/30 text-violet-200' : isVisited ? 'border-violet-500/30 bg-violet-600/10 text-violet-300' : 'border-gray-700 bg-gray-900 text-white'}`}>
                              {value}
                            </div>
                          )
                        })
                      )}
                    </div>
                  </div>
                )}

                {activePattern === 'DP' && (
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-300">
                      <span className="rounded-xl border border-gray-700 bg-gray-900 px-3 py-2 font-semibold text-white">Max: {currentVisualStep?.maxProd}</span>
                      <span className="rounded-xl border border-gray-700 bg-gray-900 px-3 py-2 font-semibold text-white">Min: {currentVisualStep?.minProd}</span>
                      <span className="rounded-xl border border-violet-500/30 bg-violet-600/10 px-3 py-2 font-semibold text-violet-300">Best: {currentVisualStep?.best}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {[2, 3, -2, 4].map((value, index) => (
                        <div key={`${value}-${index}`} className={`rounded-xl border px-3 py-2 text-sm font-semibold ${index === currentVisualStep?.index ? 'border-violet-500 bg-violet-600/20 text-violet-300' : 'border-gray-700 bg-gray-900 text-white'}`}>
                          {value}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activePattern === 'Binary Search' && (
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      {[5, 7, 7, 8, 8, 10].map((value, index) => {
                        const isMid = index === currentVisualStep?.mid
                        const inRange = index >= (currentVisualStep?.low ?? 0) && index <= (currentVisualStep?.high ?? 0)
                        return (
                          <div key={`${value}-${index}`} className={`flex h-12 w-12 items-center justify-center rounded-xl border text-sm font-black ${isMid ? 'border-violet-500 bg-violet-600/30 text-violet-200' : inRange ? 'border-violet-500/30 bg-violet-600/10 text-violet-300' : 'border-gray-700 bg-gray-900 text-gray-500'}`}>
                            {value}
                          </div>
                        )
                      })}
                    </div>
                    <div className="rounded-2xl border border-gray-800 bg-gray-900 p-4 text-sm text-gray-300">
                      Phase: {currentVisualStep?.phase}
                    </div>
                  </div>
                )}

                {activePattern === "Floyd's Cycle Detection" && (
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                      {[1, 3, 4, 2, 2].map((value, index) => (
                        <div key={`${value}-${index}`} className={`flex h-12 w-12 items-center justify-center rounded-xl border text-sm font-black ${index === currentVisualStep?.slow && index === currentVisualStep?.fast ? 'border-violet-500 bg-violet-600/30 text-violet-200' : index === currentVisualStep?.slow ? 'border-green-500 bg-green-500/10 text-green-300' : index === currentVisualStep?.fast ? 'border-red-500 bg-red-500/10 text-red-300' : 'border-gray-700 bg-gray-900 text-white'}`}>
                          {value}
                        </div>
                      ))}
                    </div>
                    <div className="rounded-2xl border border-gray-800 bg-gray-900 p-4 text-sm text-gray-300">
                      <span className="text-green-400">Slow: {currentVisualStep?.slow}</span> • <span className="text-red-400">Fast: {currentVisualStep?.fast}</span>
                    </div>
                  </div>
                )}

                {activePattern === 'Index as Hash' && (
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {(currentVisualStep?.state || []).map((value, index) => (
                        <div key={`${value}-${index}`} className={`flex h-12 w-12 items-center justify-center rounded-xl border text-sm font-black ${index === currentVisualStep?.index || index === currentVisualStep?.target ? 'border-violet-500 bg-violet-600/20 text-violet-300' : 'border-gray-700 bg-gray-900 text-white'}`}>
                          {value}
                        </div>
                      ))}
                    </div>
                    {currentVisualStep?.missing && (
                      <div className="rounded-2xl border border-gray-800 bg-gray-900 p-4 text-sm text-gray-300">
                        First missing positive: {currentVisualStep.missing}
                      </div>
                    )}
                  </div>
                )}

                {activePattern === 'Two Heaps' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-2xl border border-gray-800 bg-gray-900 p-4">
                        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-gray-500">Lower half (max-heap)</p>
                        <div className="flex flex-wrap gap-2">
                          {(currentVisualStep?.lower || []).map((value, index) => (
                            <span key={index} className={`rounded-full px-3 py-1 text-sm font-semibold ${index === 0 ? 'bg-green-500/20 text-green-300' : 'bg-gray-800 text-gray-300'}`}>{value}</span>
                          ))}
                        </div>
                      </div>
                      <div className="rounded-2xl border border-gray-800 bg-gray-900 p-4">
                        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-gray-500">Upper half (min-heap)</p>
                        <div className="flex flex-wrap gap-2">
                          {(currentVisualStep?.upper || []).map((value, index) => (
                            <span key={index} className={`rounded-full px-3 py-1 text-sm font-semibold ${index === 0 ? 'bg-red-500/20 text-red-300' : 'bg-gray-800 text-gray-300'}`}>{value}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="rounded-2xl border border-violet-500/20 bg-violet-600/10 px-4 py-3 text-center text-sm font-semibold text-violet-200">
                      Median: {currentVisualStep?.median}
                    </div>
                  </div>
                )}

                {activePattern === 'Merge Sort / BIT' && (
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    {[5, 2, 6, 1].map((value, index) => (
                      <div key={`${value}-${index}`} className={`flex flex-col items-center gap-1 rounded-xl border px-3 py-2 text-sm font-semibold ${index === currentVisualStep?.index ? 'border-violet-500 bg-violet-600/20 text-violet-300' : 'border-gray-700 bg-gray-900 text-white'}`}>
                        <span>{value}</span>
                        <span className="text-xs text-gray-500">count: {currentVisualStep?.counts?.[index] ?? 0}</span>
                      </div>
                    ))}
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