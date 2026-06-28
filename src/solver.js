const CARD_VALUES = new Map([
  ["A", 1],
  ["J", 11],
  ["Q", 12],
  ["K", 13],
]);

export function parseCardValue(input) {
  const text = String(input).trim().toUpperCase();
  if (!text) {
    throw new Error("牌面不可空白");
  }

  if (CARD_VALUES.has(text)) {
    return CARD_VALUES.get(text);
  }

  const value = Number(text);
  if (!Number.isFinite(value) || !Number.isInteger(value)) {
    throw new Error(`無法辨識牌面：${input}`);
  }

  return value;
}

export function solveNumbers(values, target = 24, options = {}) {
  const numbers = values.map((value) => {
    const numeric = Number(value);
    if (!Number.isFinite(numeric) || !Number.isInteger(numeric)) {
      throw new Error(`不是有效整數：${value}`);
    }
    return {
      value: numeric,
      expression: formatNumber(numeric),
    };
  });

  const numericTarget = Number(target);
  if (!Number.isFinite(numericTarget) || !Number.isInteger(numericTarget)) {
    throw new Error("目標必須是整數");
  }

  const solutions = new Map();
  dfs(numbers, numericTarget, Boolean(options.allowConcat), solutions);
  return [...solutions.values()].sort((a, b) => a.length - b.length || a.localeCompare(b));
}

function dfs(items, target, allowConcat, solutions) {
  if (items.length === 1) {
    if (items[0].value === target) {
      solutions.set(normalizeExpression(items[0].expression), items[0].expression);
    }
    return;
  }

  for (let i = 0; i < items.length; i += 1) {
    for (let j = i + 1; j < items.length; j += 1) {
      const left = items[i];
      const right = items[j];
      const rest = items.filter((_, index) => index !== i && index !== j);

      for (const result of combine(left, right, allowConcat)) {
        dfs([...rest, result], target, allowConcat, solutions);
      }
    }
  }
}

function combine(left, right, allowConcat) {
  const results = [
    {
      value: left.value + right.value,
      expression: `(${left.expression} + ${right.expression})`,
    },
    {
      value: left.value * right.value,
      expression: `(${left.expression} * ${right.expression})`,
    },
    {
      value: left.value - right.value,
      expression: `(${left.expression} - ${right.expression})`,
    },
    {
      value: right.value - left.value,
      expression: `(${right.expression} - ${left.expression})`,
    },
  ];

  if (right.value !== 0 && left.value % right.value === 0) {
    results.push({
      value: left.value / right.value,
      expression: `(${left.expression} / ${right.expression})`,
    });
  }

  if (left.value !== 0 && right.value % left.value === 0) {
    results.push({
      value: right.value / left.value,
      expression: `(${right.expression} / ${left.expression})`,
    });
  }

  if (allowConcat && canConcat(left, right)) {
    results.push(concatPair(left, right));
    results.push(concatPair(right, left));
  }

  return results;
}

function canConcat(left, right) {
  return Number.isInteger(left.value) && Number.isInteger(right.value) && left.value >= 0 && right.value >= 0;
}

function concatPair(left, right) {
  const expression = `${stripOuterParens(left.expression)}${stripOuterParens(right.expression)}`;
  return {
    value: Number(expression),
    expression,
  };
}

function stripOuterParens(expression) {
  return expression.replace(/^\((.*)\)$/u, "$1");
}

function formatNumber(value) {
  return String(value);
}

function normalizeExpression(expression) {
  return expression.replace(/\s+/gu, "");
}
