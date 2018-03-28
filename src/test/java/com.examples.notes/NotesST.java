package com.examples.notes;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.is;
import static org.springframework.restdocs.hypermedia.HypermediaDocumentation.halLinks;
import static org.springframework.restdocs.hypermedia.HypermediaDocumentation.linkWithRel;
import static org.springframework.restdocs.hypermedia.HypermediaDocumentation.links;
import static org.springframework.restdocs.payload.PayloadDocumentation.fieldWithPath;
import static org.springframework.restdocs.payload.PayloadDocumentation.responseFields;
import static org.springframework.restdocs.restassured3.RestAssuredRestDocumentation.document;

import org.apache.http.HttpStatus;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.restdocs.RestDocumentationContextProvider;
import org.springframework.restdocs.RestDocumentationExtension;
import org.springframework.restdocs.restassured3.RestAssuredRestDocumentation;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import com.example.notes.Note;

import io.restassured.RestAssured;
import io.restassured.builder.RequestSpecBuilder;
import io.restassured.specification.RequestSpecification;

@ExtendWith({RestDocumentationExtension.class, SpringExtension.class})
public class NotesST {

    private RequestSpecification spec;

    @BeforeAll
    public void setUp(RestDocumentationContextProvider restDocumentation) {
        this.spec = new RequestSpecBuilder().addFilter(RestAssuredRestDocumentation.documentationConfiguration(restDocumentation))
                .build();
    }


    @Test
    public void sample() throws Exception {

        Note note = new Note();
        note.setBody("myBody");
        note.setTitle("myTitle");
        given(this.spec).body(note).when().post().then().assertThat().statusCode(is(HttpStatus.SC_CREATED));


        RestAssured.given(this.spec)
                .accept("application/json")
                .filter(document("index", links(halLinks(), linkWithRel("notes").description("Link to the alpha resource"),
                        linkWithRel("tags").description("Link to the bravo resource"))))
                .when()
                .get("/")
                .then()
                .assertThat()
                .statusCode(is(200));


        given(this.spec).accept("application/json")
                .filter(document("notes",
                        responseFields(fieldWithPath("title").description("myTitle"), fieldWithPath("body").description("myBody"))))
                .when()
                .get("/notes/1")
                .then()
                .assertThat()
                .statusCode(is(200));


    }
}
