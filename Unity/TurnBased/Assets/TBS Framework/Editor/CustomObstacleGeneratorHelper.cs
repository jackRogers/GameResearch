using UnityEngine;
using UnityEditor;

[CustomEditor(typeof(CustomObstacleGenerator))]
public class CustomObstacleGeneratorHelper : Editor
{
    public override void OnInspectorGUI()
    {
        base.OnInspectorGUI();

        CustomObstacleGenerator obstacleGenerator = (CustomObstacleGenerator)target;

        if(GUILayout.Button("Snap to Grid"))
        {
            obstacleGenerator.SnapToGrid();
        }
    }
}
