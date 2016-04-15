using UnityEngine;
using System.Collections;

public class Mover : MonoBehaviour {
	public float speed;
	private Rigidbody rb;

	// Use this for initialization
	void Start () {
		
		rb = GetComponent<Rigidbody> ();

		rb.velocity = transform.forward * speed;
	}
	
	// Update is called once per frame
	void Update () {
	
	}
}
