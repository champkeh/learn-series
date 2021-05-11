#version 450

layout(std430, set = 0, binding = 0) readonly buffer FirstMatrix {
    vec2 size;
    float numbers[];
} firstMatrix;

layout(std430, set = 0, binding = 1) readonly buffer SecondMatrix {
    vec2 size;
    float numbers[];
} secondMatrix;

layout(std430, set = 0, binding = 2) buffer ResultMatrix {
    vec2 size;
    float numbers[];
} resultMatrix;

void main() {
    resultMatrix.size = vec2(firstMatrix.size.x, secondMatrix.size.y);

    ivec2 resultCell = ivec2(gl_GlobalInvocationID.x, gl_GlobalInvocationID.y);
    float result = 0.0;
    for (int i = 0; i < firstMatrix.size.y; i++) {
        int a = i + resultCell.x * int(firstMatrix.size.y);
        int b = resultCell.y + i * int(secondMatrix.size.y);
        result += firstMatrix.numbers[a] * secondMatrix.numbers[b];
    }

    int index = resultCell.y + resultCell.x * int(secondMatrix.size.y);
    resultMatrix.numbers[index] = result;
}
