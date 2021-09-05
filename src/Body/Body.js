import './Body.css'
import React, { useState, useEffect } from 'react'
import Popup from 'reactjs-popup'
import db from './firebase'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';


function Body() {

	const [ideas, setIdeas] = useState([]);
	const [title, setTitle] = useState("");
	const [filter, setFilter] = useState("");
	const [content, setContent] = useState("");
	const [newTitle, setNewTitle] = useState("");
	const [isSorted, setIsSorted] = useState(false);
	const [newContent, setNewContent] = useState("");
	const [ideasList, setIdeasList] = useState(ideas);

	React.useEffect(() => { 
		const fetch = async () => {
			const data = await db.collection('ideas').get();
			setIdeas(data.docs.map(doc => doc.data()));
		}
		fetch();
	}, [])

	const addIdea = (e) => {
		e.preventDefault();
		if (title !== "" && content !== "") {
			let idea = { id: new Date().getTime().toString(), title: title, content: content };
			db.collection('ideas').doc(idea.id).set({ id: idea.id, title: idea.title, content: idea.content, author: });
			setIdeas([...ideas, idea]);
		} else {
			alert("You cannot enter null values in title and content box!");
		}
		setTitle("");
		setContent("");
	}

	const editIdea = (requiredId) => {

		if (newTitle === "" || newContent === "") {
			alert("You cannot enter null values in title and content box!");
			return;
		}
		console.log('edit');
		var newIdeas = [];
		for (var i = 0; i < ideas.length; i ++) {
			if (ideas[i].id === requiredId) {
				let idea = {id: ideas[i].id, title: newTitle, content: newContent};
				db.collection('ideas').doc(idea.id).set({ id: idea.id, title: newTitle, content: newContent });
				newIdeas.push(idea);
			} else {
				newIdeas.push(ideas[i]);
			}
		}
		setIdeas(newIdeas);
		setNewTitle("");
		setNewContent("");
	}

	const deleteIdea = (requiredId) => {
		console.log('delete');
		var newIdeas = [];
		for (var i = 0; i < ideas.length; i ++) {
			if (ideas[i].id === requiredId) {
				db.collection('ideas').doc(ideas[i].id).delete();
				continue;
			} else {
				newIdeas.push(ideas[i]);
			}
		}
		setIdeas(newIdeas);
	}

	const sortIdeas = () => { 
		if (isSorted) {
			setIsSorted(false);
		} else {
			setIsSorted(true);
		}
		console.log('sorting')
		var newIdeas = [];
		for (var i = 0; i < ideas.length; i ++) {
			newIdeas.push(ideas[i]);
		}
		newIdeas.sort((a, b) => (a.title > b.title) ? 1 : -1);
		setIdeas(newIdeas);
	}

	const handleOnDragEnd = (result) => {
		const items = [];
		for (var i = 0; i < ideas.length; i ++) {
			items.push(ideas[i]);
		}
		const [newIdeas] = items.splice(result.source.index, 1);
		items.splice(result.destination.index, 0, newIdeas);
		setIdeas(items);
	}

	const deleteAllIdeas = () => {
		for (var i = 0; i < ideas.length; i ++) {
			db.collection('ideas').doc(ideas[i].id).delete();
		}
		setIdeas([]);
	}

	const addFilter = (e) => { 
		if (filter === "") {
			setIdeas(ideasList);
			return;
		} else {
			setIdeasList(ideas);
			let newIdeas = [];
			for (let i = 0; i < ideas.length; i ++) {
				if (ideas[i].title === filter) {
					newIdeas.push(ideas[i]);
				}
			}
			setIdeas(newIdeas);
		}
		setFilter("");
	}

	return (
		<div>
			<div className="features">
				<div className="features__selection">
					<div className="features__selection__text">
						Filter by: 
					</div>
					<Popup trigger={
						<button className="features__selection__button">
							Select
						</button>
					} position="right top">
						<div className="features__selection__popup">
							<input type="text" className="features__selection__input" 
								placeholder='Enter filter ("" for no filter)'
								value={ filter }
								onChange={ (e) => setFilter(e.target.value) }
							/>
							<button className="features__selection__button" onClick={ addFilter }>
								Search
							</button>
						</div>
					</Popup>
				</div>
				<div className="features__buttons">
					<Popup trigger={
						<button className="features__newidea">
							New 
						</button>
					} position="left top">
						<div className="features__popup">
							<input className="features__popup__titleinput" 
								type="text" 
								placeholder="Write the idea title here..."
								value={ title }
								onChange={ (e) => setTitle(e.target.value) }
							/>
							<input className="features__popup__textinput" 
								type="text" 
								placeholder="Write the idea content here..."
								value={ content }
								onChange={ (e) => setContent(e.target.value) }
							/>
							<button className="features__popup__submit" type="submit" onClick={ addIdea }>
								Create
							</button>
						</div>
					</Popup>
					<button className="features__sort" onClick={ sortIdeas }>
						Sort
					</button>
					<button className="features__deleteall" onClick={ deleteAllIdeas }>
						Delete All
					</button>
				</div>
			</div>
			
			<div className="condition">
				{ 
					false ? (
						ideas.map((idea) => {
							return (
								<div className="body__idea" key={ idea.id }>
									<p className="body__idea__title">
										{ idea.title }
									</p>
									<p className="body__idea__content">
										{ idea.content }
									</p>
									<div className="body__idea__buttons">
										<Popup trigger={
											<button className="body__idea__edit">
												Edit
											</button>
										} position="right top">
											<div className="body__popup">
												<input className="body__popup__titleinput" 
													type="text" 
													placeholder="Write the idea title here..."
													value={ newTitle }
													onChange={ (e) => setNewTitle(e.target.value) }
												/>
												<input className="body__popup__textinput" 
													type="text" 
													placeholder="Write the idea content here..."
													value={ newContent }
													onChange={ (e) => setNewContent(e.target.value) }
												/>
												<button className="body__popup__submit" type="submit" onClick={ () => { editIdea(idea.id) } }>
													Done
												</button>
											</div>
										</Popup>
										<button className="body__idea__delete" onClick={ () => { deleteIdea(idea.id) } }>
											Delete
										</button>
									</div>
								</div>	
							)
						})
				 	) : (
					<DragDropContext className="body" onDragEnd={ handleOnDragEnd }>
						<Droppable droppableId="ideas">
							{(provided) => (
								<ul {...provided.droppableProps} ref={provided.innerRef}>
									{ ideas.map((idea, index) => { 
										return (
											<Draggable draggableId={ idea.id }  key={ idea.id } index={ index }>
												{(provided) => (
													<div className="body__idea" {...provided.draggableProps} ref={provided.innerRef} {...provided.dragHandleProps}>
														<p className="body__idea__title">
															{ idea.title }
														</p>
														<p className="body__idea__content">
															{ idea.content }
														</p>
														<div className="body__idea__buttons">
															<Popup trigger={
																<button className="body__idea__edit">
																	Edit
																</button>
															} position="right top">
																<div className="body__popup">
																	<input className="body__popup__titleinput" 
																		type="text" 
																		placeholder="Write the idea title here..."
																		value={ newTitle }
																		onChange={ (e) => setNewTitle(e.target.value) }
																	/>
																	<input className="body__popup__textinput" 
																		type="text" 
																		placeholder="Write the idea content here..."
																		value={ newContent }
																		onChange={ (e) => setNewContent(e.target.value) }
																	/>
																	<button className="body__popup__submit" type="submit" onClick={ () => { editIdea(idea.id) } }>
																		Done
																	</button>
																</div>
															</Popup>
															<button className="body__idea__delete" onClick={ () => { deleteIdea(idea.id) } }>
																Delete
															</button>
														</div>
													</div>
												)}
											</Draggable>
										);	
									})}
								</ul>
							)}
						</Droppable>
					</DragDropContext>
				)}
			</div>
		</div>
	);
}

export default Body