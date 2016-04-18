using UnityEngine;
using System.Collections;

public class CameraController : MonoBehaviour {

	// Use this for initialization
	void Start () {

	}
	
	// Update is called once per frame
	void Update () {
        float moveHorizontal = Input.GetAxis("Horizontal");
        float moveVertical = Input.GetAxis("Vertical");
        float moveScrollWheel = Input.GetAxis("Mouse ScrollWheel");
        Vector3 movement = new Vector3(moveHorizontal, -moveScrollWheel, moveVertical);
        transform.position = transform.position + movement;

    }

}
